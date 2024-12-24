import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const configService = app.get(ConfigService);
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     forbidNonWhitelisted: true,
  //     transform: true,
  //   }),
  // );

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  // const port = configService.get<number>('PORT') || 3000;
  const port = parseInt(process.env.PORT, 10) || 3000;
  await app.listen(port);
  console.log(`Server is running on port ${port}`);
}

bootstrap();
