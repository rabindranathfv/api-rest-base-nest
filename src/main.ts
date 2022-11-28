import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(Logger));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // delete fields non define into the dto class
      forbidNonWhitelisted: true, // show extra fields into errors from the dto class
      transform: true, // validate and transform into Js object, helps a lot with types
    }),
  );
  await app.listen(3000);
}
bootstrap();
