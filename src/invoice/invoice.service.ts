import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice } from './schemas/invoice.schema';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel(Invoice.name) private readonly invoiceModel: Model<Invoice>,
  ) {}

  async createInvoice(invoiceDto: Partial<Invoice>): Promise<Invoice> {
    return this.invoiceModel.create({
      ...invoiceDto,
      date: new Date(), // Ensure the current date is added
    });
  }

  async getInvoiceById(id: string): Promise<Invoice> {
    const invoice = await this.invoiceModel.findById(id).exec();
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return invoice;
  }

  async getInvoices(filter: any): Promise<Invoice[]> {
    const query = {};
    if (filter.startDate && filter.endDate) {
      query['date'] = {
        $gte: new Date(filter.startDate),
        $lte: new Date(filter.endDate),
      };
    }
    return this.invoiceModel.find(query).exec();
  }
}
