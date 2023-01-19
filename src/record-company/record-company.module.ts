import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { BigqueryModule } from 'src/bigquery/bigquery.module';

import { RecordCompanyController } from './record-company.controller';
import { RecordCompanyService } from './record-company.service';

import { RECORD_COMPANY_REPOSITORY } from './repository/record-company.repository';
import { RecordCompanyAdapterRepository } from './repository/record-company-adapter.repository';
import { BIG_QUERY_REPOSITORY } from './../bigquery/repository/big-query.repository';
import { BigQueryAdapterRepository } from '../bigquery/repository/big-query-adapter.repository';
import { configuration } from 'src/config/configuration';

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
  controllers: [RecordCompanyController],
  providers: [
    RecordCompanyService,
    {
      provide: BIG_QUERY_REPOSITORY,
      useClass: BigQueryAdapterRepository,
    },
    {
      provide: RECORD_COMPANY_REPOSITORY,
      useClass: RecordCompanyAdapterRepository,
    },
  ],
})
export class RecordCompanyModule {}
