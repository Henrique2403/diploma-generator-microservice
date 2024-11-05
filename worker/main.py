import pika
from services import *

def main() -> None:
    # Configura a conexão com o RabbitMQ
    connection = pika.BlockingConnection(pika.ConnectionParameters('rabbitmq'))
    channel = connection.channel()
    
    # Declaração da fila que será consumida
    queue_name = 'degreesQueue'
    channel.queue_declare(queue=queue_name, durable=True)
    
    # Callback para processar mensagens
    def callback(ch, method, properties, body) -> None:
        try:
            print(f"Recebendo mensagem: {body}")
            process_message(body)  # Envia a mensagem para o manipulador
            ch.basic_ack(delivery_tag=method.delivery_tag)  # Confirma que a mensagem foi processada com sucesso
        except Exception as e:
            print(f"Erro ao processar mensagem: {e}")
            ch.basic_nack(delivery_tag=method.delivery_tag, requeue=True)  # Reenfileira a mensagem em caso de erro
    
    # Configura o consumo da fila
    channel.basic_consume(queue=queue_name, on_message_callback=callback)
    
    print("Aguardando mensagens...")
    channel.start_consuming()  # Começa a ouvir a fila

    
    #body = {
    #    "student_name":"João Silva",
    #    "nacionality":"Brasileiro",
    #    "state":"São Paulo",
    #    "birthday":"1990-05-20",
    #    "document":"12345678901",
    #    "conclusion_date":"2023-07-15",
    #    "course":"Engenharia de Software",
    #    "workload":"240 horas",
    #    "emission_date":"2023-08-01",
    #    "template_diploma":"Modelo de Diploma de Conclusão",
    #    "name":"Maria Oliveira",
    #    "job_position":"Coordenadora de Cursos"
    #}
    #process_message(body)

if __name__ == "__main__":
    main()