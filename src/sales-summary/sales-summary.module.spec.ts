import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SalesSummaryModule } from './sales-summary.module';
import { SalesSummaryService } from './sales-summary.service';
import { SalesReportGeneratorService } from './sales-report-generator.service';
import { InvoiceModule } from '../invoice/invoice.module';
import { RabbitmqModule } from '../shared/rabbitmq/rabbitmq.module';

describe('SalesSummaryModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        MongooseModule.forRootAsync({
          useFactory: async () => ({
            // uri: configService.get<string>('DATABASE_URL'),
            uri: process.env.DATABASE_URL,
          }),
          inject: [ConfigService],
        }),
        InvoiceModule,
        SalesSummaryModule,
        RabbitmqModule,
      ],
      providers: [
        SalesSummaryService,
        SalesReportGeneratorService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('mongodb://localhost:27017/testdb'),
          },
        },
      ],
    }).compile();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    const summaryService = module.get<SalesSummaryService>(SalesSummaryService);
    const reportService = module.get<SalesReportGeneratorService>(
      SalesReportGeneratorService,
    );
    expect(summaryService).toBeDefined();
    expect(reportService).toBeDefined();
  });
});
