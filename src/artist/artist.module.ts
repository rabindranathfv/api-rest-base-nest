import { ArtistAdapterRepository } from './repository/artist-adapter.repository';
import { ARTIST_REPOSITORY } from './repository/artist.repository';
import { CacheModule, Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { JwtStrategy } from './../auth/jwt.strategy';

import { BigqueryModule } from '../bigquery/bigquery.module';
import { BIG_QUERY_REPOSITORY } from '../bigquery/repository/big-query.repository';
import { BigQueryAdapterRepository } from '../bigquery/repository/big-query-adapter.repository';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BigqueryModule,
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
    JwtStrategy,
  ],
})
export class ArtistModule {}
