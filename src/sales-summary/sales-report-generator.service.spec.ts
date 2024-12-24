import { Test, TestingModule } from '@nestjs/testing';
import { SalesReportGeneratorService } from './sales-report-generator.service';
import { InvoiceService } from '../invoice/invoice.service';

describe('SalesReportGeneratorService', () => {
  let service: SalesReportGeneratorService;
  let invoiceService: InvoiceService;

  const mockInvoices = [
    {
      customer: 'Mhdi esmi',
      amount: 100,
      items: [
        { sku: 'item1', qt: 2 },
        { sku: 'item2', qt: 1 },
      ],
    },
    {
      customer: 'Mhdi esmi',
      amount: 200,
      items: [{ sku: 'item1', qt: 1 }],
    },
  ];

  const mockInvoiceService = {
    getInvoices: jest.fn().mockResolvedValue(mockInvoices),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SalesReportGeneratorService,
        { provide: InvoiceService, useValue: mockInvoiceService },
      ],
    }).compile();

    service = module.get<SalesReportGeneratorService>(
      SalesReportGeneratorService,
    );
    invoiceService = module.get<InvoiceService>(InvoiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be  generated a sales report for today', async () => {
    const report = await service.generateReport();

    expect(invoiceService.getInvoices).toHaveBeenCalledWith({
      startDate: expect.any(String),
      endDate: expect.any(String),
    });

    expect(report).toEqual({
      date: expect.any(Date),
      totalSales: 300, // Sum of 100 + 200
      itemSummary: {
        item1: 3, // 2 from first invoice, 1 from second
        item2: 1,
      },
    });
  });
});
