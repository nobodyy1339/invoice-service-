import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceModule } from './invoice/invoice.module';
import { SalesSummaryModule } from './sales-summary/sales-summary.module';
import { ScheduleModule } from '@nestjs/schedule';

describe('AppModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it('should compile the AppModule', async () => {
    expect(module).toBeDefined();
  });

  it('should import ConfigModule as a global module', () => {
    const configModule = module.get<ConfigModule>(ConfigModule);
    expect(configModule).toBeDefined();
  });

  it('should import MongooseModule', () => {
    const mongooseModule = module.get<MongooseModule>(MongooseModule);
    expect(mongooseModule).toBeDefined();
  });

  it('should import InvoiceModule', () => {
    const invoiceModule = module.get<InvoiceModule>(InvoiceModule);
    expect(invoiceModule).toBeDefined();
  });

  it('should import SalesSummaryModule', () => {
    const salesSummaryModule =
      module.get<SalesSummaryModule>(SalesSummaryModule);
    expect(salesSummaryModule).toBeDefined();
  });

  it('should import ScheduleModule', () => {
    const scheduleModule = module.get<ScheduleModule>(ScheduleModule);
    expect(scheduleModule).toBeDefined();
  });
});
