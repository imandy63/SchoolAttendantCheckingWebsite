import { RabbitMQ } from "../rabbitmq";
import { RABBITMQ_CONFIG } from "../configs/rabbit.config";
import { BadRequestError } from "../core/error.response";
import { Notification_type } from "../enum/notificationType.enum";

class NotificationService {
  static rabbitmq = RabbitMQ.getInstance();
  static async sendNotification({
    userIds,
    title,
    message,
    type,
  }: {
    userIds: string[];
    title: string;
    message: string;
    type: Notification_type;
  }) {
    if (!RABBITMQ_CONFIG.QUEUE_NAME) {
      throw new BadRequestError("Notification error on server");
    }
    const data = {
      notification_receivers: userIds,
      notification_title: title,
      notification_details: message,
      notification_type: type,
    };

    await NotificationService.rabbitmq.sendMessage(
      RABBITMQ_CONFIG.QUEUE_NAME,
      JSON.stringify(data)
    );
  }
}

export { NotificationService };
