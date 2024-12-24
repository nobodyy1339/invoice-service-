import { Test, TestingModule } from '@nestjs/testing';
import { RabbitMQPublisher } from './rabbitmq.publisher';
import { ClientProxy } from '@nestjs/microservices';

describe('RabbitMQPublisher', () => {
  let publisher: RabbitMQPublisher;
  let clientProxy: ClientProxy;

  const mockClientProxy = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RabbitMQPublisher, { provide: 'SALES_REPORT', useValue: {} }],
    })
      .overrideProvider('SALES_REPORT')
      .useValue(mockClientProxy)
      .compile();

    publisher = module.get<RabbitMQPublisher>(RabbitMQPublisher);
    clientProxy = module.get<ClientProxy>('SALES_REPORT');
  });

  it('should publish a message successfully', async () => {
    mockClientProxy.emit.mockReturnValue({
      toPromise: jest.fn().mockResolvedValue(undefined),
    });

    await expect(
      publisher.publish('test_queue', { key: 'value' }),
    ).resolves.not.toThrow();

    expect(clientProxy.emit).toHaveBeenCalledWith('test_queue', {
      key: 'value',
    });
  });

  it('should throw an error when publish fails', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {}); // Suppress console.error
    const queueName = 'test_queue';
    const message = { test: 'message' };

    mockClientProxy.emit.mockImplementation(() => {
      throw new Error('Failed to emit');
    });

    await expect(publisher.publish(queueName, message)).rejects.toThrow(
      'Failed to emit',
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      `Failed to publish message to queue ${queueName}:`,
      expect.any(Error),
    );

    consoleErrorSpy.mockRestore(); // Restore console.error after test
  });
});
