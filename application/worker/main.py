import json
import pika
from .services import *

def main() -> None:

    connection = pika.BlockingConnection(pika.ConnectionParameters('rabbitmq'))
    channel = connection.channel()
    
    queue_name = 'degreesQueue'
    channel.queue_declare(queue=queue_name, durable=True)
    
    print("Aguardando mensagens...")
    
    # Função pra tentar reprocessar a mensagem
    async def callback(ch, method, properties, body) -> None:
        try:
            await process_message(json.loads(body))
            ch.basic_ack(delivery_tag=method.delivery_tag)  
            print("Mensagem processada com sucesso!")
        except Exception as e:
            print(f"Erro ao processar mensagem: {e}")
            ch.basic_nack(delivery_tag=method.delivery_tag, requeue=True)
    
    channel.basic_consume(queue=queue_name, on_message_callback=callback)
    
    channel.start_consuming() 

if __name__ == "__main__":
    main()