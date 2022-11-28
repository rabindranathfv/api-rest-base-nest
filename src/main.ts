import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configServ = app.get(ConfigService);
  const appLogger = app.get(Logger);
  app.useLogger(appLogger);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // delete fields non define into the dto class
      forbidNonWhitelisted: true, // show extra fields into errors from the dto class
      transform: true, // validate and transform into Js object, helps a lot with types
    }),
  );
  appLogger.log(`Running on ENVIROMENT:${configServ.get('NODE_ENV')}`);
  await app.listen(configServ.get('PORT'));
}
bootstrap();
