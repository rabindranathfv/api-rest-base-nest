import {
  MiddlewareConsumer,
  Module,
  NestModule,
  CacheModule,
  CacheInterceptor,
} from '@nestjs/common';
import { IncomingMessage } from 'http';
import { LoggerModule } from 'nestjs-pino';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppService } from './app.service';

import { configuration } from './config/configuration';

import {
  RequestIdMiddleware,
  REQUEST_ID_HEADER,
} from './middlewares/request-id/request-id.middleware';
import { validationSchema } from './config/env-schema';

import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { BigqueryModule } from './bigquery/bigquery.module';
import { ArtistModule } from './artist/artist.module';
import { RecordCompanyModule } from './record-company/record-company.module';
import { SongModule } from './song/song.module';

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
            : /* istanbul ignore next */ undefined,
        messageKey: 'message',
        customProps: (req: IncomingMessage) => {
          /* istanbul ignore next */
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
        /* istanbul ignore next */
        const mongoConfig = configService.get('MONGO');
        /* istanbul ignore next */
        return { uri: mongoConfig.uri };
      },
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        /* istanbul ignore next */
        const cacheConfig = configService.get('CACHE');
        /* istanbul ignore next */
        return {
          isGlobal: true,
          ttl: Number(cacheConfig.ttl),
          max: Number(cacheConfig.storage),
        };
      },
    }),
    UserModule,
    AuthModule,
    BigqueryModule,
    ArtistModule,
    RecordCompanyModule,
    SongModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ConfigModule,
    // cache all endpoints with this config
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  /* istanbul ignore next */
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
