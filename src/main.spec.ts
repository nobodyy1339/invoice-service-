import { bootstrap } from './main';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn().mockResolvedValue({
      useGlobalPipes: jest.fn(),
      listen: jest.fn().mockResolvedValue(undefined),
    }),
  },
}));

jest.mock('@nestjs/common', () => {
  const actualCommon = jest.requireActual('@nestjs/common');
  return {
    ...actualCommon,
    ValidationPipe: jest.fn().mockImplementation(() => ({
      transformOptions: { transform: true },
    })),
  };
});

describe('Application Bootstrap', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should use the port from process.env.PORT if defined', async () => {
    process.env.PORT = '4000';
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    await bootstrap();

    const app = await NestFactory.create(AppModule);

    // Ensure `useGlobalPipes` is called with specific instance of ValidationPipe
    expect(app.useGlobalPipes).toHaveBeenCalledWith(
      expect.objectContaining({
        transformOptions: { transform: true },
      }),
    );

    // Ensure the app listens on the correct port
    expect(app.listen).toHaveBeenCalledWith(4000);
    expect(consoleSpy).toHaveBeenCalledWith('Server is running on port 4000');

    consoleSpy.mockRestore();
  });

  it('should default to port 3000 if process.env.PORT is not defined', async () => {
    delete process.env.PORT;
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    await bootstrap();

    const app = await NestFactory.create(AppModule);

    // Ensure `useGlobalPipes` is called with specific instance of ValidationPipe
    expect(app.useGlobalPipes).toHaveBeenCalledWith(
      expect.objectContaining({
        transformOptions: { transform: true },
      }),
    );

    // Ensure the app listens on the default port
    expect(app.listen).toHaveBeenCalledWith(3000);
    expect(consoleSpy).toHaveBeenCalledWith('Server is running on port 3000');

    consoleSpy.mockRestore();
  });
});
