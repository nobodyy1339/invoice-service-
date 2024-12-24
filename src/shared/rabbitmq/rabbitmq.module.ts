import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQPublisher } from './rabbitmq.publisher';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'SALES_REPORT',
        imports: [ConfigModule],
        useFactory: async () => ({
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RABBITMQ_URL],
            queue: process.env.RABBITMQ_QUEUE,
            queueOptions: { durable: true },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    RabbitmqModule,
  ],
  providers: [RabbitMQPublisher],
  exports: [RabbitMQPublisher],
})
export class RabbitmqModule {}
