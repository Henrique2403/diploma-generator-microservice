import pika
from queue_handle import process_message

def main() -> None:
    # Configura a conexão com o RabbitMQ
    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
    channel = connection.channel()
    
    # Declaração da fila que será consumida
    queue_name = 'degreesQueue'
    channel.queue_declare(queue=queue_name, durable=True)
    
    # Callback para processar mensagens
    def callback(ch, method, properties, body):
        print(f"Recebendo mensagem: {body}")
        process_message(body)  # Envia a mensagem para o manipulador
        ch.basic_ack(delivery_tag=method.delivery_tag)  # Confirma que a mensagem foi processada

    # Configura o consumo da fila
    channel.basic_consume(queue=queue_name, on_message_callback=callback)
    
    print("Aguardando mensagens...")
    channel.start_consuming()  # Começa a ouvir a fila

if __name__ == "__main__":
    main()