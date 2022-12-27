import { BigQueryAdapterRepository } from './repository/big-query-adapter.repository';
import { BIG_QUERY_REPOSITORY } from './repository/big-query.repository';
import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from 'src/config/configuration';
import { BigqueryController } from './bigquery.controller';
import { BigqueryService } from './bigquery.service';

@Module({
  imports: [
    ConfigModule.forFeature(configuration),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const cacheConfig = configService.get('CACHE');
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
