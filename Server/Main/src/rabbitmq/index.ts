import amqplib, { Connection, Channel } from "amqplib";
import { RABBITMQ_CONFIG } from "../configs/rabbit.config";

class RabbitMQ {
  private connection: Connection | null = null;
  private channel: Channel | null = null;

  static instance: RabbitMQ;

  static getInstance(): RabbitMQ {
    if (!RabbitMQ.instance) {
      RabbitMQ.instance = new RabbitMQ();
    }
    return RabbitMQ.instance;
  }

  async connect(): Promise<void> {
    try {
      if (!RABBITMQ_CONFIG.URL) throw new Error("RabbitMQ URL is not defined");
      this.connection = await amqplib.connect(RABBITMQ_CONFIG.URL);
      this.channel = await this.connection.createChannel();
      console.log("RabbitMQ connected");
    } catch (error) {
      console.error("RabbitMQ connection error:", error);
    }
  }

  async createQueue(queueName: string): Promise<void> {
    if (!this.channel) throw new Error("Channel is not initialized");
    await this.channel.assertQueue(queueName, { durable: true });
  }

  async sendMessage(queueName: string, message: string): Promise<void> {
    if (!this.channel) throw new Error("Channel is not initialized");
    await this.channel.sendToQueue(queueName, Buffer.from(message), {
      persistent: true,
    });
    console.log(`Message sent to queue ${queueName}: ${message}`);
  }

  async consumeMessages(
    queueName: string,
    callback: (msg: string) => void
  ): Promise<void> {
    if (!this.channel) throw new Error("Channel is not initialized");

    await this.channel.consume(queueName, (message) => {
      if (message) {
        const msgContent = message.content.toString();
        console.log(`Received message from queue ${queueName}: ${msgContent}`);
        callback(msgContent);
        this.channel?.ack(message);
      }
    });
  }

  async close(): Promise<void> {
    await this.channel?.close();
    await this.connection?.close();
  }
}

export { RabbitMQ };
