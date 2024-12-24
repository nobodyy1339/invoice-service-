import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Item {
  @Prop({ required: true })
  sku: string;

  @Prop({ required: true })
  qt: number;
}

@Schema()
export class Invoice extends Document {
  @Prop({ required: true })
  customer: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  reference: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ type: [Item], required: true })
  items: Item[];
}

export const ItemSchema = SchemaFactory.createForClass(Item);
export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
