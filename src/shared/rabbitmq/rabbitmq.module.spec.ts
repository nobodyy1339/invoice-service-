import { Test, TestingModule } from '@nestjs/testing';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitmqModule } from './rabbitmq.module';
import { RabbitMQPublisher } from './rabbitmq.publisher';

describe('RabbitmqModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        ClientsModule.registerAsync([
          {
            name: 'SALES_REPORT',
            imports: [ConfigModule],
            useFactory: async () => ({
              transport: Transport.RMQ,
              options: {
                // urls: [configService.get<string>('RABBITMQ_URL')],
                urls: [process.env.RABBITMQ_URL],
                queue: 'daily_sales_report',
                queueOptions: { durable: true },
              },
            }),
            inject: [ConfigService],
          },
        ]),
        RabbitmqModule,
      ],
      providers: [
        RabbitMQPublisher,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('amqp://localhost:5672'),
          },
        },
      ],
    }).compile();
  });

  it('should be defined', () => {
    const publisher = module.get<RabbitMQPublisher>(RabbitMQPublisher);
    expect(publisher).toBeDefined();
  });
});
