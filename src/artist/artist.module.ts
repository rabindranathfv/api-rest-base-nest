import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { JwtStrategy } from './../auth/jwt.strategy';

import { BigqueryModule } from '../bigquery/bigquery.module';
import { BIG_QUERY_REPOSITORY } from '../bigquery/repository/big-query.repository';
import { BigQueryAdapterRepository } from '../bigquery/repository/big-query-adapter.repository';

import { ArtistAdapterRepository } from './repository/artist-adapter.repository';
import { ARTIST_REPOSITORY } from './repository/artist.repository';

const passportModule = PassportModule.register({ defaultStrategy: 'jwt' });
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
    passportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        /* istanbul ignore next */
        const jwtConfig = configService.get('JWT');
        /* istanbul ignore next */
        return {
          secret: jwtConfig.secret,
          signOptions: { expiresIn: jwtConfig.expiresIn || '1h' },
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
  exports: [passportModule],
})
export class ArtistModule {}
