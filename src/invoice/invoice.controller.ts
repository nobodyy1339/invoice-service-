import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './create-invoice.dto';
import { isValidObjectId } from 'mongoose';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  async createInvoice(@Body() invoiceDto: CreateInvoiceDto) {
    return this.invoiceService.createInvoice(invoiceDto);
  }

  @Get(':id')
  async getInvoiceById(@Param('id') id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid ID format');
    }
    return this.invoiceService.getInvoiceById(id);
  }

  @Get()
  async getInvoices(@Query() query: { startDate?: string; endDate?: string }) {
    return this.invoiceService.getInvoices(query);
  }
}
