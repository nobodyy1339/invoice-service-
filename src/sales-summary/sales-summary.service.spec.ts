import { Test, TestingModule } from '@nestjs/testing';
import { SalesSummaryService } from './sales-summary.service';
import { SalesReportGeneratorService } from './sales-report-generator.service';
import { RabbitMQPublisher } from '../shared/rabbitmq/rabbitmq.publisher';

describe('SalesSummaryService', () => {
  let service: SalesSummaryService;
  let reportGenerator: SalesReportGeneratorService;
  let rabbitPublisher: RabbitMQPublisher;

  const mockReportGenerator = {
    generateReport: jest.fn(),
  };

  const mockRabbitPublisher = {
    publish: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks(); // Full reset before each test
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalesSummaryService,
        { provide: SalesReportGeneratorService, useValue: mockReportGenerator },
        { provide: RabbitMQPublisher, useValue: mockRabbitPublisher },
      ],
    }).compile();

    service = module.get<SalesSummaryService>(SalesSummaryService);
    reportGenerator = module.get<SalesReportGeneratorService>(
      SalesReportGeneratorService,
    );
    rabbitPublisher = module.get<RabbitMQPublisher>(RabbitMQPublisher);
  });

  it('should generate and publish a sales summary successfully', async () => {
    const mockReport = { date: new Date(), totalSales: 500, itemSummary: {} };
    mockReportGenerator.generateReport.mockResolvedValue(mockReport);
    mockRabbitPublisher.publish.mockResolvedValue(undefined);

    await expect(service.handleDailySalesSummary()).resolves.not.toThrow();

    expect(reportGenerator.generateReport).toHaveBeenCalledTimes(1);
    expect(rabbitPublisher.publish).toHaveBeenCalledWith(
      'sales-report',
      mockReport,
    );
  });

  it('should handle errors during the daily sales summary', async () => {
    const error = new Error('Failed to generate report');
    mockReportGenerator.generateReport.mockRejectedValue(error);

    await service.handleDailySalesSummary();

    expect(reportGenerator.generateReport).toHaveBeenCalledTimes(1);
    expect(rabbitPublisher.publish).not.toHaveBeenCalled();
  });
});
