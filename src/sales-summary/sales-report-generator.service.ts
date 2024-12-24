import { Injectable } from '@nestjs/common';
import { InvoiceService } from '../invoice/invoice.service';

@Injectable()
export class SalesReportGeneratorService {
  constructor(private readonly invoiceService: InvoiceService) {}

  async generateReport() {
    const now = new Date();

    // Use UTC start and end of the day
    const startOfDayUTC = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        0,
        0,
        0,
      ),
    );
    const endOfDayUTC = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate(),
        23,
        59,
        59,
      ),
    );

    const invoices = await this.invoiceService.getInvoices({
      startDate: startOfDayUTC.toISOString(),
      endDate: endOfDayUTC.toISOString(),
    });

    const totalSales = invoices.reduce(
      (sum, invoice) => sum + invoice.amount,
      0,
    );

    const itemSummary = invoices
      .flatMap((invoice) => invoice.items)
      .reduce((acc, item) => {
        acc[item.sku] = (acc[item.sku] || 0) + item.qt;
        return acc;
      }, {});

    return {
      date: startOfDayUTC,
      totalSales,
      itemSummary,
    };
  }
}
