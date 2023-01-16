import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/common';
import { BigqueryModule } from '../bigquery/bigquery.module';

import { ArtistService } from './artist.service';

import { MockType } from 'src/bigquery/bigquery.service.spec';
import { ARTIST_REPOSITORY } from './repository/artist.repository';
import { artistsMockData } from './mocks/artistsMock';
import { songsByartistsMockData } from './mocks/songsByArtist';
import { artistDetailMockData } from './mocks/artistDetailMock';
import { artistKpiOverview } from './mocks/artistKpiOverview';
import { radioStationStadistic } from './mocks/radioStationKPI';

describe('ArtistService:::', () => {
  let service: ArtistService;
  let repository: MockType<any>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        BigqueryModule,
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
      providers: [
        ArtistService,
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

    service = module.get<ArtistService>(ArtistService);
    repository = module.get(ARTIST_REPOSITORY);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should call getAllArtists and return all the artists', async () => {
    const getAllArtistsSpy = jest
      .spyOn(repository, 'getAllArtists')
      .mockImplementation(() => Promise.resolve(artistsMockData));

    const serviceResp = await service.getAllArtists();

    expect(serviceResp).toEqual(artistsMockData);
    expect(getAllArtistsSpy).toHaveBeenCalled();
  });

  it('should call getAllArtists and return 500 exception because some error happens after repository response', async () => {
    const getAllArtistsSpy = jest
      .spyOn(repository, 'getAllArtists')
      .mockImplementation(() => {
        throw new Error('error');
      });

    try {
      await service.getAllArtists();
    } catch (error) {
      expect(getAllArtistsSpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(Error);
      expect(error['status']).toBe(500);
    }
  });

  it('should call getAllSongsByArtists and return songs by the artist', async () => {
    const getAllSongsByArtistsSpy = jest
      .spyOn(repository, 'getAllSongsByArtists')
      .mockImplementation(() => Promise.resolve(songsByartistsMockData));

    const serviceResp = await service.getAllSongsByArtists();

    expect(serviceResp).toEqual(songsByartistsMockData);
    expect(getAllSongsByArtistsSpy).toHaveBeenCalled();
  });

  it('should call getAllSongsByArtists and return 500 exception because some error happens after repository response', async () => {
    const getAllSongsByArtistsSpy = jest
      .spyOn(repository, 'getAllSongsByArtists')
      .mockImplementation(() => {
        throw new Error('error');
      });

    try {
      await service.getAllSongsByArtists();
    } catch (error) {
      expect(getAllSongsByArtistsSpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(Error);
      expect(error['status']).toBe(500);
    }
  });

  it('should call getArtistSummary and return summary info for the artist', async () => {
    const getArtistSummarySpy = jest
      .spyOn(repository, 'getArtistSummary')
      .mockImplementation(() => Promise.resolve(artistDetailMockData));

    const serviceResp = await service.getArtistSummary();

    expect(serviceResp).toEqual(artistDetailMockData);
    expect(getArtistSummarySpy).toHaveBeenCalled();
  });

  it('should call getArtistSummary and return 500 exception because some error happens after repository response', async () => {
    const getArtistSummarySpy = jest
      .spyOn(repository, 'getArtistSummary')
      .mockImplementation(() => {
        throw new Error('error');
      });

    try {
      await service.getArtistSummary();
    } catch (error) {
      expect(getArtistSummarySpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(Error);
      expect(error['status']).toBe(500);
    }
  });

  it('should call getArtistKpi and return kpi of the artist', async () => {
    const getArtistKpiSpy = jest
      .spyOn(repository, 'getArtistKpi')
      .mockImplementation(() => Promise.resolve(artistKpiOverview));

    const serviceResp = await service.getArtistKpi();

    expect(serviceResp).toEqual(artistKpiOverview);
    expect(getArtistKpiSpy).toHaveBeenCalled();
  });

  it('should call getArtistKpi and return 500 exception because some error happens after repository response', async () => {
    const getArtistKpiSpy = jest
      .spyOn(repository, 'getArtistKpi')
      .mockImplementation(() => {
        throw new Error('error');
      });

    try {
      await service.getArtistKpi();
    } catch (error) {
      expect(getArtistKpiSpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(Error);
      expect(error['status']).toBe(500);
    }
  });

  it('should call getArtistRadioStationKpi and return kpi of the artist', async () => {
    const getArtistRadioStationKpiSpy = jest
      .spyOn(repository, 'getArtistRadioStationKpi')
      .mockImplementation(() => Promise.resolve(radioStationStadistic));

    const serviceResp = await service.getArtistRadioStationKpi();

    expect(serviceResp).toEqual(radioStationStadistic);
    expect(getArtistRadioStationKpiSpy).toHaveBeenCalled();
  });

  it('should call getArtistRadioStationKpi and return 500 exception because some error happens after repository response', async () => {
    const getArtistRadioStationKpiSpy = jest
      .spyOn(repository, 'getArtistRadioStationKpi')
      .mockImplementation(() => {
        throw new Error('error');
      });

    try {
      await service.getArtistRadioStationKpi();
    } catch (error) {
      expect(getArtistRadioStationKpiSpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(Error);
      expect(error['status']).toBe(500);
    }
  });
});
