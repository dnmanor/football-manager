import * as amqp from 'amqplib';

export class RabbitMQService {
  private static instance: RabbitMQService;
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;

  private constructor() {}

  static getInstance(): RabbitMQService {
    if (!RabbitMQService.instance) {
      RabbitMQService.instance = new RabbitMQService();
    }
    return RabbitMQService.instance;
  }

  async connect() {
    try {
      this.connection = await amqp.connect('amqp://guest:guest@localhost:5672');
      this.channel = await this.connection.createChannel();
      console.log('✅ Connected to RabbitMQ');
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
      throw error;
    }
  }

  async publishUserCreated(userId: string) {
    if (!this.channel) {
      throw new Error('RabbitMQ channel not initialized');
    }

    const queue = 'user-created';
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.sendToQueue(queue, Buffer.from(userId));
  }

  async consumeUserCreated(callback: (userId: string) => Promise<void>) {
    if (!this.channel) {
      throw new Error('RabbitMQ channel not initialized');
    }

    const queue = 'user-created';
    await this.channel.assertQueue(queue, { durable: true });
    
    this.channel.consume(queue, async (msg) => {
      if (msg) {
        const userId = msg.content.toString();
        try {
          await callback(userId);
          this.channel?.ack(msg);
        } catch (error) {
          console.error('Error processing message:', error);
          this.channel?.nack(msg);
        }
      }
    });
  }
}