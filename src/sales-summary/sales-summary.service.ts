import { Injectable } from '@nestjs/common';
import { SalesReportGeneratorService } from './sales-report-generator.service';
import { RabbitMQPublisher } from '../shared/rabbitmq/rabbitmq.publisher';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class SalesSummaryService {
  constructor(
    private readonly salesReportGeneratorService: SalesReportGeneratorService,
    private readonly rabbitMQPublisher: RabbitMQPublisher,
  ) {}

  // @Cron('0 12 * * *')
  @Cron('*/50 * * * * *')
  async handleDailySalesSummary() {
    try {
      const report = await this.salesReportGeneratorService.generateReport();
      console.log('call publish_report!!!!!!!!!!!', report);

      await this.rabbitMQPublisher.publish('sales-report', report);
    } catch (error) {
      console.error('Failed to handle daily sales summary:', error.message);
    }
  }
}
