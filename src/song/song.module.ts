import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { BigqueryModule } from '../bigquery/bigquery.module';

import { SongController } from './song.controller';
import { SongService } from './song.service';
import { JwtStrategy } from './../auth/jwt.strategy';

import { BIG_QUERY_REPOSITORY } from './../bigquery/repository/big-query.repository';
import { BigQueryAdapterRepository } from './../bigquery/repository/big-query-adapter.repository';
import { SONG_REPOSITORY } from './repository/song.repository';
import { SongAdapterRepository } from './repository/song-adapter.repository';
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
  controllers: [SongController],
  providers: [
    SongService,
    {
      provide: BIG_QUERY_REPOSITORY,
      useClass: BigQueryAdapterRepository,
    },
    {
      provide: SONG_REPOSITORY,
      useClass: SongAdapterRepository,
    },
    JwtStrategy,
  ],
})
export class SongModule {}
