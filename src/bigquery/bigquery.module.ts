import { BigQueryAdapterRepository } from './repository/big-query-adapter.repository';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BigqueryController } from './bigquery.controller';
import { BigqueryService } from './bigquery.service';

import { configuration } from '../config/configuration';
import { BIG_QUERY_REPOSITORY } from './repository/big-query.repository';

@Module({
  imports: [ConfigModule.forFeature(configuration)],
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
