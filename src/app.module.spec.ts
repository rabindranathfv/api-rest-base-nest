import { Test, TestingModule } from '@nestjs/testing';
import { CacheInterceptor, CacheModule } from '@nestjs/common';
import { IncomingMessage } from 'http';
import { LoggerModule } from 'nestjs-pino';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { BigqueryModule } from './bigquery/bigquery.module';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { RecordCompanyModule } from './record-company/record-company.module';
import { ArtistModule } from './artist/artist.module';
import { SongModule } from './song/song.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { configuration } from './config/configuration';

import { REQUEST_ID_HEADER } from './middlewares/request-id/request-id.middleware';
import { validationSchema } from './config/env-schema';

describe('AppModule:::', () => {
  let moduleInst: AppModule;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
            customProps: (req: IncomingMessage) => {
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
        CacheModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            const cacheConfig = configService.get('CACHE');
            return {
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
        AppModule,
        AppService,
        {
          provide: APP_INTERCEPTOR,
          useClass: CacheInterceptor,
        },
      ],
    }).compile();

    moduleInst = module.get(AppModule);
  });

  it('should be defined', () => {
    expect(moduleInst).toBeDefined();
  });
});
