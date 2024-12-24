import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitMQPublisher {
  constructor(@Inject('SALES_REPORT') private rabbitClient: ClientProxy) {}

  async publish(queueName: string, message: any) {
    try {
      this.rabbitClient.emit(queueName, message);
    } catch (error) {
      console.error(`Failed to publish message to queue ${queueName}:`, error);
      throw error;
    }
  }
}
