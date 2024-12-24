import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceModule } from '../src/invoice/invoice.module';
import * as dotenv from 'dotenv';

dotenv.config();
describe('InvoiceController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const uri = process.env.DATABASE_URL_TEST;
    if (!uri) {
      throw new Error('DATABASE_URL_TEST is not defined');
    }

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(uri), InvoiceModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /invoices should create a new invoice', () => {
    return request(app.getHttpServer())
      .post('/invoices')
      .send({
        reference: 'REF123',
        customer: 'Customer1',
        amount: 100,
        items: [{ sku: 'SKU1', qt: 2 }],
      })
      .expect(201)
      .expect((res) => {
        expect(res.body.reference).toBe('REF123');
      });
  });

  it('GET /invoices/:id should return an invoice', async () => {
    const response = await request(app.getHttpServer())
      .post('/invoices')
      .send({
        reference: 'REF123',
        customer: 'Customer1',
        amount: 100,
        items: [{ sku: 'SKU1', qt: 2 }],
      });

    return request(app.getHttpServer())
      .get(`/invoices/${response.body._id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.reference).toBe('REF123');
      });
  });

  it('GET /invoices/:id should return 404 if invoice not found', () => {
    const nonExistingId = '507f191e810c19729de860ea'; // Example of a valid but non-existing ID

    return request(app.getHttpServer())
      .get(`/invoices/${nonExistingId}`)
      .expect(404)
      .expect((res) => {
        expect(res.body.message).toBe(
          `Invoice with ID ${nonExistingId} not found`,
        );
      });
  });

  it('GET /invoices/:id should return 404 if invoice not found', () => {
    return request(app.getHttpServer())
      .get('/invoices/non-existing-id')
      .expect(400);
  });

  it('GET /invoices should return a list of invoices', () => {
    return request(app.getHttpServer())
      .get('/invoices')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  it('GET /invoices with filters should return filtered invoices', () => {
    return request(app.getHttpServer())
      .get('/invoices?startDate=2023-01-01&endDate=2023-12-31')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });
});
