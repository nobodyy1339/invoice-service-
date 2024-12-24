import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InvoiceModule } from './invoice.module';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { Invoice, InvoiceSchema } from './schemas/invoice.schema';

describe('InvoiceModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        MongooseModule.forRootAsync({
          useFactory: async () => ({
            uri: process.env.DATABASE_URL_TEST,
          }),
          inject: [ConfigService],
        }),
        MongooseModule.forFeature([
          { name: Invoice.name, schema: InvoiceSchema },
        ]),
        InvoiceModule,
      ],
    }).compile();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    const service = module.get<InvoiceService>(InvoiceService);
    const controller = module.get<InvoiceController>(InvoiceController);
    expect(service).toBeDefined();
    expect(controller).toBeDefined();
  });
});
