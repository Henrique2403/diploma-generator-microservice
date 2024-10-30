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
      const connection = await amqp.connect('amqp://rabbitmq');
      const channel = await connection.createChannel();
      const queue = 'diplomasQueue';
  
      await channel.assertQueue(queue, { durable: true });
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
  
      console.log("Mensagem enviada para fila:", message);
    } catch (error) {
      console.error("Erro ao enviar mensagem para fila:", error);
    }
  }

// Middleware para analisar JSON
app.use(express.json());

// Endpoint POST
app.post('/certificate', (req, res) => {
    const {
        name,
        nacionality,
        state,
        bday,
        document,
        conclusion_date,
        course,
        workload,
        emission_date,
        signature,
        job_position
    } = req.body; 



    // Responda com uma mensagem de sucesso
    res.status(201).json({
        message: 'Dados recebidos com sucesso!',
        receivedData: data,
    });
});

// Endpoint GET
app.get('/certificate/:name/:course', (req, res) => {
    const name = req.params.name;

    const course = req.params.course;
});

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`API rodando em http://localhost:${PORT}`);
});
