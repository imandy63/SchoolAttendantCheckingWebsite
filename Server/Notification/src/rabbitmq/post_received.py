from src.configs.rabbitmq_config import RabbitMQConfigs
from src.rabbitmq.pika_client import RabbitMQConsumer
import json
from src.utils.message_dto_checker import dictToLower,MessageDtoChecker
from src.models.notification_model import BulkNotification
from datetime import datetime
from src.services.notification_service import NotificationService

class PostMessageReceive:
    queuename = RabbitMQConfigs.NOTIFICATION_QUEUE

    def callback(ch, method, properties, body):
        payload = json.loads(body)
        isRightFormat = MessageDtoChecker(payload)
        ch.basic_ack(delivery_tag=method.delivery_tag)
        if isRightFormat:
            notis = BulkNotification(**payload, notification_send_time=datetime.utcnow())
            NotificationService.bulkCreateMessage(notis)
        
    def __init__(self):
        try:
            self.consumer = RabbitMQConsumer(self.queuename)
            self.consumer.registerTask(PostMessageReceive.callback)
        except KeyboardInterrupt:
            self.consumer.closeConnection()