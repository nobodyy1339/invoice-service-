import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateInvoiceDto } from './create-invoice.dto';

describe('InvoiceController', () => {
  let controller: InvoiceController;
  let mockInvoiceService: {
    createInvoice: jest.Mock;
    getInvoiceById: jest.Mock;
    getInvoices: jest.Mock;
  };

  beforeEach(async () => {
    mockInvoiceService = {
      createInvoice: jest.fn(),
      getInvoiceById: jest.fn(),
      getInvoices: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceController],
      providers: [
        {
          provide: InvoiceService,
          useValue: mockInvoiceService,
        },
      ],
    }).compile();

    controller = module.get<InvoiceController>(InvoiceController);
  });

  describe('createInvoice', () => {
    it('should create an invoice successfully', async () => {
      const createInvoiceDto: CreateInvoiceDto = {
        reference: 'REF123',
        customer: 'Customer1',
        amount: 100,
        items: [{ sku: 'SKU1', qt: 2 }],
      };

      mockInvoiceService.createInvoice.mockResolvedValue(createInvoiceDto);

      const result = await controller.createInvoice(createInvoiceDto);

      expect(result).toEqual(createInvoiceDto);
      expect(mockInvoiceService.createInvoice).toHaveBeenCalledWith(
        createInvoiceDto,
      );
    });

    it('should throw an error when required fields are missing', async () => {
      const incompleteDto = {
        reference: 'REF123',
        customer: 'Customer1',
        amount: 100,
      }; // Missing 'items'

      mockInvoiceService.createInvoice.mockImplementation(() => {
        throw new BadRequestException('Validation failed');
      });

      await expect(
        controller.createInvoice(incompleteDto as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getInvoiceById', () => {
    it('should return an invoice by ID successfully', async () => {
      const id = '507f191e810c19729de860ea';
      const invoice = {
        reference: 'REF123',
        customer: 'Customer1',
        amount: 100,
      };

      mockInvoiceService.getInvoiceById.mockResolvedValue(invoice);

      const result = await controller.getInvoiceById(id);

      expect(result).toEqual(invoice);
      expect(mockInvoiceService.getInvoiceById).toHaveBeenCalledWith(id);
    });

    it('should throw BadRequestException for invalid ID format', async () => {
      const invalidId = 'invalid-id';

      await expect(controller.getInvoiceById(invalidId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if invoice not found by ID', async () => {
      const validId = '507f191e810c19729d4360ea';

      mockInvoiceService.getInvoiceById.mockImplementation(() => {
        throw new NotFoundException(`Invoice with ID ${validId} not found`);
      });

      await expect(controller.getInvoiceById(validId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockInvoiceService.getInvoiceById).toHaveBeenCalledWith(validId);
    });
  });

  describe('getInvoices', () => {
    it('should return invoices based on query filters', async () => {
      const filter = { startDate: '2023-01-01', endDate: '2023-12-31' };
      const invoices = [
        { reference: 'REF123', customer: 'Customer1', amount: 100 },
      ];

      mockInvoiceService.getInvoices.mockResolvedValue(invoices);

      const result = await controller.getInvoices(filter);

      expect(result).toEqual(invoices);
      expect(mockInvoiceService.getInvoices).toHaveBeenCalledWith(filter);
    });

    it('should return all invoices when no filters are provided', async () => {
      const invoices = [
        { reference: 'REF123', customer: 'Customer1', amount: 100 },
      ];

      mockInvoiceService.getInvoices.mockResolvedValue(invoices);

      const result = await controller.getInvoices({});

      expect(result).toEqual(invoices);
      expect(mockInvoiceService.getInvoices).toHaveBeenCalledWith({});
    });

    it('should handle invalid date format in filters gracefully', async () => {
      const invalidFilter = {
        startDate: 'invalid-date',
        endDate: '2023-12-31',
      };

      mockInvoiceService.getInvoices.mockResolvedValue([]);

      const result = await controller.getInvoices(invalidFilter);

      expect(result).toEqual([]); // Graceful fallback to empty results
      expect(mockInvoiceService.getInvoices).toHaveBeenCalledWith(
        invalidFilter,
      );
    });
  });
});
