import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

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
  appLogger.log(
    `Running on ENVIROMENT:${configServ.get<string>(
      'NODE_ENV',
    )} on PORT: ${configServ.get<string>('PORT')}`,
  );

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('API REST BASE NEST')
    .setDescription('Api Rest in Ts with repositories based')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('user')
    .addTag('artist')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs/', app, document);

  await app.listen(configServ.get<string>('PORT'));
}
bootstrap();
