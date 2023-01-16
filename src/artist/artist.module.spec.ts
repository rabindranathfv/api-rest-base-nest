import { Test, TestingModule } from '@nestjs/testing';
import { CacheModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { ArtistModule } from './artist.module';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { BigqueryModule } from '../bigquery/bigquery.module';

import { configuration } from '../config/configuration';
import { BIG_QUERY_REPOSITORY } from '../bigquery/repository/big-query.repository';
import { ARTIST_REPOSITORY } from './repository/artist.repository';

describe('ArtistModule:::', () => {
  let moduleInst: ArtistModule;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        BigqueryModule,
        ConfigModule.forFeature(configuration),
        CacheModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            const cacheConfig = configService.get('CACHE');
            return {
              ttl: Number(cacheConfig.ttl),
              max: Number(cacheConfig.storage),
            };
          },
        }),
      ],
      controllers: [ArtistController],
      providers: [
        ArtistModule,
        ArtistService,
        {
          provide: BIG_QUERY_REPOSITORY,
          useFactory: () => ({
            connectWithBigquery: () => jest.fn(),
            query: () => jest.fn(),
            check: () => jest.fn(),
            connectWithDatastorage: () => jest.fn(),
            checkDs: () => jest.fn(),
          }),
        },
        {
          provide: ARTIST_REPOSITORY,
          useFactory: () => ({
            getArtistRadioStationKpi: () => jest.fn(),
            getArtistKpi: () => jest.fn(),
            getArtistSummary: () => jest.fn(),
            getAllArtists: () => jest.fn(),
            getAllSongsByArtists: () => jest.fn(),
          }),
        },
      ],
    }).compile();

    moduleInst = module.get(ArtistModule);
  });

  it('should be defined', () => {
    expect(moduleInst).toBeDefined();
  });
});
