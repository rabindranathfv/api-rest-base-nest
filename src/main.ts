import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
