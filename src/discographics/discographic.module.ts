import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { BigqueryModule } from '../bigquery/bigquery.module';

import { DiscographicController } from './discographic.controller';
import { DiscographicService } from './discographic.service';

import { BIG_QUERY_REPOSITORY } from './../bigquery/repository/big-query.repository';
import { BigQueryAdapterRepository } from '../bigquery/repository/big-query-adapter.repository';
import { DISCOGRAPHIC_REPOSITORY } from './repository/discographic.repository';
import { DiscographicAdapterRepository } from './repository/discographic-adapter.repository';
import { configuration } from '../config/configuration';

@Module({
  imports: [
    BigqueryModule,
    ConfigModule.forFeature(configuration),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        /* istanbul ignore next */
        const cacheConfig = configService.get('CACHE');
        /* istanbul ignore next */
        return {
          ttl: Number(cacheConfig.ttl),
          max: Number(cacheConfig.storage),
        };
      },
    }),
  ],
  controllers: [DiscographicController],
  providers: [
    DiscographicService,
    {
      provide: BIG_QUERY_REPOSITORY,
      useClass: BigQueryAdapterRepository,
    },
    {
      provide: DISCOGRAPHIC_REPOSITORY,
      useClass: DiscographicAdapterRepository,
    },
  ],
})
export class DiscographicModule {}
