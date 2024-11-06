const express = require('express');
const mysql = require('mysql2');
const amqp = require('amqplib');
const app = express();

// Conexão com o MySQL
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  });

connection.connect((err) => {
    if (err) throw err;
    console.log('Conectado ao MySQL!');
});

// Conexão RabbitMQ
async function sendToQueue(message) {
    try {
      const RABBITMQ_HOST = process.env.RABBITMQ_HOST || "rabbitmq";
      const connection = await amqp.connect(`amqp://${RABBITMQ_HOST}`);
      const channel = await connection.createChannel();
      const queue = 'degreesQueue';
  
      await channel.assertQueue(queue, { durable: true });
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
  
      console.log("Mensagem enviada para fila:", message);
    } catch (error) {
      console.error("Erro ao enviar mensagem para fila:", error);
    }
}

// Middleware para analisar JSON
app.use(express.json());

// Ex: http://localhost:3000/degree
// body - raw - JSON
// {
//    "student_name":"João Silva",
//    "nacionality":"Brasileiro",
//    "state":"São Paulo",
//    "birthday":"1990-05-20",
//    "document":"12345678901",
//    "conclusion_date":"2023-07-15",
//    "course":"Engenharia de Software",
//    "workload":"240 horas",
//    "emission_date":"2023-08-01",
//    "template_diploma":"Modelo de Diploma de Conclusão",
//    "name":"Maria Oliveira",
//    "job_position":"Coordenadora de Cursos"
// }
app.post('/degree', (req, res) => {
    const {
        student_name,
        nacionality,
        state,
        birthday,
        document,
        conclusion_date,
        course,
        workload,
        emission_date,
        template_degree,
        name,
        job_position
    } = req.body; 

  // Salvando os dados no MySQL
  const query = `INSERT INTO degrees (student_name, nacionality, state, birthday, document, 
    conclusion_date, course, workload, emission_date, template_degree, name, job_position) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  connection.query(query, [
    student_name,
    nacionality,
    state,
    birthday,
    document,
    conclusion_date,
    course,
    workload,
    emission_date,
    template_degree,
    name,
    job_position
  ], (err, result) => {
    if (err) {
      console.error("Erro ao salvar no MySQL:", err);
      return res.status(500).send('Erro ao salvar no banco de dados.');
    }
    
    // Enviar os dados para a fila RabbitMQ
    sendToQueue(req.body);

    res.status(200).send('Dados recebidos e processados com sucesso.');
    });
});

//Ex: http://localhost:3000/degree/111111111/Sistemas%20de%20Informação
app.get('/degree/:document/:course', (req, res) => {

    const document = decodeURIComponent(req.params.document);
    const course = decodeURIComponent(req.params.course);

    const query = "SELECT template_diploma FROM degrees WHERE document = ? AND course = ?"

    connection.query(query, [document, course], (err, results) => {
      if (err) {
          console.error("Erro ao buscar o diploma:", err);
          res.status(500).send("Erro no servidor");
          return;
      }

      if (results.length > 0) {
          res.send(results[0].template_diploma);
      } else {
          res.status(404).send("Diploma não encontrado");
      }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}`);
});
