import { Module } from '@nestjs/common';
import { InvoiceModule } from './invoice/invoice.module';
import { SalesSummaryModule } from './sales-summary/sales-summary.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: process.env.DATABASE_URL,
      }),
      inject: [ConfigService],
    }),
    InvoiceModule,
    ScheduleModule.forRoot(),
    SalesSummaryModule,
  ],
})
export class AppModule {}
