const express = require('express');
const mysql = require('mysql2');
const amqp = require('amqplib');
const app = express();
const { v4: uuidv4 } = require('uuid');
const { format } = require('date-fns');


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
//    "name":"Maria Oliveira",
//    "job_position":"Coordenadora de Cursos"
// }
app.post('/degree', (req, res) => {
  
  const guid = uuidv4();  
  const url = `./app/${guid}.pdf`;
  const emission_date = format(new Date(), 'dd/MM/yyyy');

  const {
    student_name,
    nacionality,
    state,
    birthday,
    document,
    conclusion_date,
    course,
    workload,
    name,
    job_position
  } = req.body; 

  // Salvando os dados no MySQL
  const query = `INSERT INTO degrees (guid, student_name, nacionality, state, birthday, document, 
    conclusion_date, course, workload, emission_date, url, name, job_position) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  connection.query(query, [
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
    job_position
  ], (err, result) => {
    if (err) {
      console.error("Erro ao salvar no MySQL:", err);
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
      job_position
    };

    // Enviar os dados para a fila RabbitMQ
    sendToQueue(message);

    res.status(200).send(`ID do certificado: ${result.insertId}`);
    });
});

//Ex: http://localhost:3000/degree/1
app.get('/degree/:id', (req, res) => {

    const id = req.params.id;

    const query = "SELECT url FROM degrees WHERE id = ?"

    connection.query(query, id, (err, results) => {
      if (err) {
          console.error("Erro ao buscar o diploma:", err);
          res.status(500).send("Erro no servidor");
          return;
      }

      if (results.length > 0) {
          res.send(results[0].url);
      } else {
          res.status(404).send("Diploma não encontrado");
      }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}`);
});
