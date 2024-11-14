from pika import PlainCredentials, ConnectionParameters, BlockingConnection, exceptions, SelectConnection
from src.configs.rabbitmq_config import RabbitMQConfigs
import json

class RabbitMQConsumer:
    def __init__(self,queue):
        try:
            self.connection = BlockingConnection(
                ConnectionParameters(host=RabbitMQConfigs.RABBITMQ_HOST,port=RabbitMQConfigs.RABBITMQ_PORT),
            )
            self.channel = self.connection.channel()
            self.queue = queue
            self.channel.queue_declare(queue=queue, durable=True)
        except exceptions.AMQPConnectionError as e:
            print("Failed to connect to RabbitMQ:", e)

    def registerTask(self, callback):
        self.channel.basic_qos(prefetch_count=1)
        self.channel.basic_consume(queue=self.queue, on_message_callback=callback)
        self.channel.start_consuming()

    def closeConnection(self):
        self.connection.close()