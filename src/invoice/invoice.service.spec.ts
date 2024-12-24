import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceService } from './invoice.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice } from './schemas/invoice.schema';
import { NotFoundException } from '@nestjs/common';

const mockInvoice = {
  _id: '12345',
  reference: 'REF123',
  customer: 'Customer1',
  amount: 100,
  date: new Date(),
  items: [{ sku: 'SKU1', qt: 2 }],
};

describe('InvoiceService', () => {
  let service: InvoiceService;
  let model: Model<Invoice>;
  const id = '12345';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        {
          provide: getModelToken(Invoice.name),
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
    model = module.get<Model<Invoice>>(getModelToken(Invoice.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('createInvoice should create a new invoice', async () => {
    jest.spyOn(model, 'create').mockResolvedValue(mockInvoice as any);

    const invoice = await service.createInvoice(mockInvoice);
    expect(invoice).toEqual(mockInvoice);
  });

  it('getInvoiceById should return an invoice', async () => {
    jest.spyOn(model, 'findById').mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockInvoice as any),
    } as any);

    const invoice = await service.getInvoiceById(id);
    expect(invoice).toEqual(mockInvoice);
  });

  it('getInvoiceById should throw NotFoundException if invoice not found', async () => {
    jest.spyOn(model, 'findById').mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    } as any);

    await expect(service.getInvoiceById('non-existing-id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('getInvoices should return a list of invoices', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValue([mockInvoice] as any),
    } as any);

    const invoices = await service.getInvoices({});
    expect(invoices).toEqual([mockInvoice]);
  });

  it('getInvoices should return filtered invoices', async () => {
    jest.spyOn(model, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValue([mockInvoice] as any),
    } as any);

    const filter = { startDate: '2023-01-01', endDate: '2023-12-31' };
    const invoices = await service.getInvoices(filter);
    expect(invoices).toEqual([mockInvoice]);
  });
});
