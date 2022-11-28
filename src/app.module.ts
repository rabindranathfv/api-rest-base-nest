import { Request } from 'express';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';

import { configuration } from './config/configuration';

import {
  RequestIdMiddleware,
  REQUEST_ID_HEADER,
} from './middlewares/request-id/request-id.middleware';

import { UsersController } from './users/users.controller';

import { UsersService } from './users/users.service';

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
      envFilePath: `${process.cwd()}/config/env/.env.${
        process.env.NODE_ENV
      }.local`,
      load: [configuration],
    }),
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
