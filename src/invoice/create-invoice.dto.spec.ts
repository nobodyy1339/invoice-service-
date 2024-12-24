import 'reflect-metadata'; // Required for class-transformer and class-validator to work properly
import { validate } from 'class-validator';
import { CreateInvoiceDto, InvoiceItemDto } from './create-invoice.dto';
import { plainToClass } from 'class-transformer';

describe('CreateInvoiceDto Custom Validation Logic', () => {
  it('should fail if "items" is not an array', async () => {
    const createInvoiceDto = new CreateInvoiceDto();
    createInvoiceDto.reference = 'INV-001';
    createInvoiceDto.customer = 'Mhdi Esmi';
    createInvoiceDto.amount = 150.25;
    createInvoiceDto.items = {} as unknown as InvoiceItemDto[]; // Invalid: not an array

    const errors = await validate(createInvoiceDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          property: 'items',
          constraints: expect.objectContaining({
            isArray: expect.any(String), // `isArray` validation error
          }),
        }),
      ]),
    );
  });

  it('should fail if an item in "items" is invalid', async () => {
    const invalidItem = new InvoiceItemDto(); // Missing required properties
    const createInvoiceDto = new CreateInvoiceDto();
    createInvoiceDto.reference = 'INV-002';
    createInvoiceDto.customer = 'Mhdi esmi';
    createInvoiceDto.amount = 200.75;
    createInvoiceDto.items = [invalidItem]; // Array with an invalid object

    const errors = await validate(createInvoiceDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          property: 'items',
          children: expect.arrayContaining([
            expect.objectContaining({
              property: '0', // First (and only) item in the array
              children: expect.arrayContaining([
                expect.objectContaining({
                  property: 'sku',
                  constraints: expect.objectContaining({
                    isNotEmpty: expect.any(String),
                    isString: expect.any(String),
                  }),
                }),
                expect.objectContaining({
                  property: 'qt',
                  constraints: expect.objectContaining({
                    isNumber: expect.any(String),
                  }),
                }),
              ]),
            }),
          ]),
        }),
      ]),
    );
  });

  it('should pass with valid nested items in "items"', async () => {
    const validItem = new InvoiceItemDto();
    validItem.sku = 'SKU12345';
    validItem.qt = 10;

    const createInvoiceDto = new CreateInvoiceDto();
    createInvoiceDto.reference = 'INV-003';
    createInvoiceDto.customer = 'Mhdi esmi';
    createInvoiceDto.amount = 300.5;
    createInvoiceDto.items = [validItem]; // Valid items array

    const errors = await validate(createInvoiceDto);

    expect(errors.length).toBe(0); // No validation errors expected
  });

  it('should fail if "items" is missing', async () => {
    const createInvoiceDto = new CreateInvoiceDto();
    createInvoiceDto.reference = 'INV-004';
    createInvoiceDto.customer = 'Mhdi esmi';
    createInvoiceDto.amount = 500;

    // `items` is not defined

    const errors = await validate(createInvoiceDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          property: 'items',
          constraints: expect.objectContaining({
            isArray: expect.any(String), // `isArray` validation error
          }),
        }),
      ]),
    );
  });

  it('should transform plain objects to InvoiceItemDto instances', async () => {
    const plainItem = { sku: 'SKU12345', qt: 10 }; // Plain object, not an instance of InvoiceItemDto

    const plainCreateInvoiceDto = {
      reference: 'INV-005',
      customer: 'Mhdi Esmi',
      amount: 450.25,
      items: [plainItem], // Array containing a plain object
    };

    // Transform plain object to class instance
    const createInvoiceDto = plainToClass(
      CreateInvoiceDto,
      plainCreateInvoiceDto,
    );

    // Validate the transformed object
    const errors = await validate(createInvoiceDto);

    // No validation errors expected because `plainItem` should be transformed correctly
    expect(errors.length).toBe(0);

    // Ensure transformation occurred
    expect(createInvoiceDto.items[0]).toBeInstanceOf(InvoiceItemDto);
  });

  it('should fail validation if transformed items are invalid', async () => {
    const invalidPlainItem = { qt: 5 }; // Missing `sku`
    const plainCreateInvoiceDto = {
      reference: 'INV-006',
      customer: 'Mhdi Esmi',
      amount: 300,
      items: [invalidPlainItem],
    };

    // Transform plain object to class instance
    const createInvoiceDto = plainToClass(
      CreateInvoiceDto,
      plainCreateInvoiceDto,
    );

    // Validate the transformed object
    const errors = await validate(createInvoiceDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          property: 'items',
          children: expect.arrayContaining([
            expect.objectContaining({
              property: '0',
              children: expect.arrayContaining([
                expect.objectContaining({
                  property: 'sku',
                  constraints: expect.objectContaining({
                    isNotEmpty: expect.any(String),
                    isString: expect.any(String),
                  }),
                }),
              ]),
            }),
          ]),
        }),
      ]),
    );
  });
});
