import { Test, TestingModule } from '@nestjs/testing';
// import {
//   CacheInterceptor,
//   CacheModule,
//   CacheModuleOptions,
// } from '@nestjs/common';
import { IncomingMessage } from 'http';
import { LoggerModule } from 'nestjs-pino';
// import { APP_INTERCEPTOR } from '@nestjs/core';
// import redisStore from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';

import { AppModule } from './app.module';
import { BigqueryModule } from './bigquery/bigquery.module';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { RecordCompanyModule } from './record-company/record-company.module';
import { ArtistModule } from './artist/artist.module';
import { SongModule } from './song/song.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import {
  getRedisToken,
  DEFAULT_REDIS_NAMESPACE,
} from '@liaoliaots/nestjs-redis';

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
        // CacheModule.registerAsync<Promise<CacheModuleOptions>>({
        //   imports: [ConfigModule],
        //   inject: [ConfigService],
        //   useFactory: async (configService: ConfigService) => {
        //     /* istanbul ignore next */
        //     const redisConfig = configService.get('REDIS');
        //     const cacheConfig = configService.get('CACHE');
        //     console.log(
        //       'CONFIG REDIS*************',
        //       redisConfig.host,
        //       redisConfig.port,
        //       cacheConfig.ttl,
        //     );
        //     /* istanbul ignore next */
        //     return {
        //       store: redisStore,
        //       isGlobal: true,
        //       host: redisConfig.host,
        //       port: redisConfig.port,
        //       ttl: cacheConfig.ttl,
        //     };
        //   },
        // }),
        RedisModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: async (
            configService: ConfigService,
          ): Promise<RedisModuleOptions> => {
            /* istanbul ignore next */
            const redisConfig = configService.get('REDIS');
            /* istanbul ignore next */
            return {
              config: {
                host: redisConfig.host,
                port: redisConfig.port,
              },
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
        { provide: getRedisToken(DEFAULT_REDIS_NAMESPACE), useValue: {} },
      ],
    }).compile();

    moduleInst = module.get(AppModule);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(moduleInst).toBeDefined();
  });
});
