import { Request } from 'express';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppService } from './app.service';

import { configuration } from './config/configuration';

import {
  RequestIdMiddleware,
  REQUEST_ID_HEADER,
} from './middlewares/request-id/request-id.middleware';
import { validationSchema } from './config/env-schema';

import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  messageKey: 'message',
                },
              }
            : undefined,
        messageKey: 'message',
        customProps: (req: Request) => {
          return {
            requestId: req[REQUEST_ID_HEADER],
          };
        },
        autoLogging: false,
        serializers: {
          req: () => undefined,
          res: () => undefined,
        },
      },
    }),
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/src/config/env/.env.${
        process.env.NODE_ENV
      }.local`,
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const mongoConfig = configService.get('MONGO');
        return { uri: mongoConfig.uri };
      },
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
