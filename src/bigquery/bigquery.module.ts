import { BigQueryAdapterRepository } from './repository/big-query-adapter.repository';
import { BIG_QUERY_REPOSITORY } from './repository/big-query.repository';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from 'src/config/configuration';
import { BigqueryController } from './bigquery.controller';
import { BigqueryService } from './bigquery.service';

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
