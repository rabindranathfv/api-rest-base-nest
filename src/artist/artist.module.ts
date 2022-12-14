import { ArtistAdapterRepository } from './repository/artist-adapter.repository';
import { ARTIST_REPOSITORY } from './repository/artist.repository';
import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';

import { BigqueryModule } from 'src/bigquery/bigquery.module';
import { BIG_QUERY_REPOSITORY } from 'src/bigquery/repository/big-query.repository';
import { BigQueryAdapterRepository } from 'src/bigquery/repository/big-query-adapter.repository';

@Module({
  imports: [BigqueryModule],
  controllers: [ArtistController],
  providers: [
    ArtistService,
    {
      provide: BIG_QUERY_REPOSITORY,
      useClass: BigQueryAdapterRepository,
    },
    {
      provide: ARTIST_REPOSITORY,
      useClass: ArtistAdapterRepository,
    },
  ],
})
export class ArtistModule {}
