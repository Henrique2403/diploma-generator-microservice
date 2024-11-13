const express = require('express');
const mysql = require('mysql2');
const amqp = require('amqplib');
const app = express();
const { v4: uuidv4 } = require('uuid');
const { format, parseISO } = require('date-fns');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Configuração do Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Diplomas',
      version: '1.0.0',
      description: 'Aplicação para a geração de certificados em formato PDF, utilizando MySQL e RabbitMQ',
    },
  },
  apis: [__filename], 
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Função para tentar conectar ao MySQL
async function connectWithRetry() {
  return new Promise((resolve) => {
    const attemptConnection = () => {
      const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
      });

      connection.connect((err) => {
        if (err) {
          console.error('Erro ao conectar ao MySQL, tentando novamente em 5 segundos...', err);
          setTimeout(attemptConnection, 5000); // Espera 5 segundos antes de tentar novamente
        } else {
          console.log('Conectado ao MySQL!');
          resolve(connection); // Resolve a Promise apenas quando a conexão é bem-sucedida
        }
      });
    };

    attemptConnection();
  });
}

// Conexão RabbitMQ
async function sendToQueue(message) {
  try {
    const RABBITMQ_HOST = process.env.RABBITMQ_HOST || 'rabbitmq';
    const connection = await amqp.connect(`amqp://${RABBITMQ_HOST}`);
    const channel = await connection.createChannel();
    const queue = 'degreesQueue';

    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });

    console.log('Mensagem enviada para fila:', message);
  } catch (error) {
    console.error('Erro ao enviar mensagem para fila:', error);
  }
}

async function startApp() {

  try {
    const connection = await connectWithRetry(); 
  
    // Middleware para analisar JSON
    app.use(express.json());

    /**
     * @swagger
     * components:
     *   schemas:
     *     Degree:
     *       type: object
     *       properties:
     *         student_name:
     *           type: string
     *           description: Nome do estudante
     *         nacionality:
     *           type: string
     *           description: Nacionalidade do estudante
     *         state:
     *           type: string
     *           description: Estado do estudante
     *         birthday:
     *           type: string
     *           format: date
     *           description: Data de nascimento do estudante
     *         document:
     *           type: string
     *           description: Documento do estudante
     *         conclusion_date:
     *           type: string
     *           format: date
     *           description: Data de conclusão do curso
     *         course:
     *           type: string
     *           description: Nome do curso
     *         workload:
     *           type: string
     *           description: Carga horária do curso
     *         name:
     *           type: string
     *           description: Nome do coordenador
     *         job_position:
     *           type: string
     *           description: Cargo do coordenador
     */

    /**
     * @swagger
     * /degree:
     *   post:
     *     summary: Cria um novo diploma
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Degree'
     *     responses:
     *       200:
     *         description: Diploma criado com sucesso
     *       500:
     *         description: Erro ao salvar no banco de dados
     */
    app.post('/degree', (req, res) => {
      const guid = uuidv4();
      const url = `/app/storage/${guid}.pdf`;
      const emission_date = format(new Date(), 'dd/MM/yyyy');

      let {
        student_name,
        nacionality,
        state,
        birthday,
        document,
        conclusion_date,
        course,
        workload,
        name,
        job_position,
      } = req.body;

      birthday, conclusion_date = format(parseISO(birthday), 'dd/MM/yyyy');

      const query = `INSERT INTO degrees (guid, student_name, nacionality, state, birthday, document, conclusion_date, course, workload, emission_date, url, name, job_position) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      connection.query(
        query,
        [
          guid,
          student_name,
          nacionality,
          state,
          birthday,
          document,
          conclusion_date,
          course,
          workload,
          emission_date,
          url,
          name,
          job_position,
        ],
        (err, result) => {
          if (err) {
            console.error('Erro ao salvar no MySQL:', err);
            return res.status(500).send('Erro ao salvar no banco de dados.');
          }

          const message = {
            guid,
            student_name,
            nacionality,
            state,
            birthday,
            document,
            conclusion_date,
            course,
            workload,
            emission_date,
            url,
            name,
            job_position,
          };

          sendToQueue(message);

          res.status(200).send(`ID do certificado: ${result.insertId}`);
        }
      );
    });

    /**
     * @swagger
     * /degree/{id}:
     *   get:
     *     summary: Retorna o diploma pelo ID
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID do diploma
     *     responses:
     *       200:
     *         description: Diploma retornado com sucesso
     *       404:
     *         description: Diploma não encontrado
     *       500:
     *         description: Erro no servidor
     */
    app.get('/degree/:id', (req, res) => {
      const id = req.params.id;

      const query = 'SELECT url FROM degrees WHERE id = ?';

      connection.query(query, id, (err, results) => {
        if (err) {
          console.error('Erro ao buscar o diploma:', err);
          res.status(500).send('Erro no servidor');
          return;
        }

        if (results.length > 0) {
          res.sendFile(path.join(results[0].url));
        } else {
          res.status(404).send('Diploma não encontrado');
        }
      });
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`API rodando em http://localhost:${PORT}`);
      console.log(`Documentação Swagger disponível em http://localhost:${PORT}/swagger`);
    });
  }catch (error){
    console.error('Não foi possível iniciar a aplicação:', error);
  }
}

startApp()