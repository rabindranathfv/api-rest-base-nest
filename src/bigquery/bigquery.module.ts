import { BigQueryAdapterRepository } from './repository/big-query-adapter.repository';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BigqueryController } from './bigquery.controller';
import { BigqueryService } from './bigquery.service';

import { configuration } from '../config/configuration';
import { BIG_QUERY_REPOSITORY } from './repository/big-query.repository';

@Module({
  imports: [
    ConfigModule.forFeature(configuration),
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
  ],
  controllers: [BigqueryController],
  providers: [
    BigqueryService,
    {
      provide: BIG_QUERY_REPOSITORY,
      useClass: BigQueryAdapterRepository,
    },
  ],
})
export class BigqueryModule {}
