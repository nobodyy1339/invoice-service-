import { Module } from '@nestjs/common';
import { SalesSummaryService } from './sales-summary.service';
import { SalesReportGeneratorService } from './sales-report-generator.service';
import { RabbitmqModule } from '../shared/rabbitmq/rabbitmq.module';
import { InvoiceModule } from '../invoice/invoice.module';

@Module({
  imports: [InvoiceModule, RabbitmqModule],
  providers: [SalesSummaryService, SalesReportGeneratorService],
})
export class SalesSummaryModule {}
