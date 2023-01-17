import { songsByartistsMockData } from './mocks/songsByArtist';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';

import { BIG_QUERY_REPOSITORY } from './../bigquery/repository/big-query.repository';
import { BigQueryAdapterRepository } from '../bigquery/repository/big-query-adapter.repository';
import { ARTIST_REPOSITORY } from './repository/artist.repository';
import { configuration } from '../config/configuration';

import { artistsMockData } from './mocks/artistsMock';
import { artistDetailMockData } from './mocks/artistDetailMock';
import { artistKpiOverview } from './mocks/artistKpiOverview';
import { radioStationStadistic } from './mocks/radioStationKPI';

describe('ArtistController', () => {
  let controller: ArtistController;
  let service: ArtistService;

  const requestMock = () => {
    const req: any = {};
    req.query = jest.fn().mockReturnValue(req);
    req.params = jest.fn().mockReturnValue(req);
    req.body = jest.fn().mockReturnValue(req);
    return req;
  };

  const responseMock = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
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
        {
          provide: BIG_QUERY_REPOSITORY,
          useClass: BigQueryAdapterRepository,
        },
      ],
    }).compile();

    controller = module.get<ArtistController>(ArtistController);
    service = module.get<ArtistService>(ArtistService);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should call getAllArtists and return all the artists', async () => {
    const getAllArtistsSpy = jest
      .spyOn(service, 'getAllArtists')
      .mockImplementation(() => Promise.resolve(artistsMockData));

    const res = responseMock() as unknown as Response;
    const ctrlResp = await controller.getAllArtists(res);

    expect(ctrlResp).toBeDefined();
    expect(getAllArtistsSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
  });

  it('should call getAllArtists and return error 404 because the service response empty', async () => {
    const getAllArtistsSpy = jest
      .spyOn(service, 'getAllArtists')
      .mockImplementation(() => Promise.resolve(null));

    const res = responseMock() as unknown as Response;
    await controller.getAllArtists(res);

    expect(getAllArtistsSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
  });

  it('should call getAllSongsByArtists and return all the artists', async () => {
    const getAllSongsByArtistsSpy = jest
      .spyOn(service, 'getAllSongsByArtists')
      .mockImplementation(() => Promise.resolve(songsByartistsMockData));

    const res = responseMock() as unknown as Response;
    const ctrlResp = await controller.getAllSongsByArtists(res);

    expect(ctrlResp).toBeDefined();
    expect(getAllSongsByArtistsSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
  });

  it('should call getAllSongsByArtists and return error 404 because the service response empty', async () => {
    const getAllSongsByArtistsSpy = jest
      .spyOn(service, 'getAllSongsByArtists')
      .mockImplementation(() => Promise.resolve(null));

    const res = responseMock() as unknown as Response;
    await controller.getAllSongsByArtists(res);

    expect(getAllSongsByArtistsSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
  });

  it('should call getArtistSummary and return all the artists', async () => {
    const getArtistSummarySpy = jest
      .spyOn(service, 'getArtistSummary')
      .mockImplementation(() => Promise.resolve(artistDetailMockData));

    const res = responseMock() as unknown as Response;
    const ctrlResp = await controller.getArtistSummary(res);

    expect(ctrlResp).toBeDefined();
    expect(getArtistSummarySpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
  });

  it('should call getArtistSummary and return error 404 because the service response empty', async () => {
    const getArtistSummarySpy = jest
      .spyOn(service, 'getArtistSummary')
      .mockImplementation(() => Promise.resolve(null));

    const res = responseMock() as unknown as Response;
    await controller.getArtistSummary(res);

    expect(getArtistSummarySpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
  });

  it('should call getArtistKpi and return all the artists', async () => {
    const getArtistKpiSpy = jest
      .spyOn(service, 'getArtistKpi')
      .mockImplementation(() => Promise.resolve(artistKpiOverview));

    const res = responseMock() as unknown as Response;
    const ctrlResp = await controller.getArtistKpi(res);

    expect(ctrlResp).toBeDefined();
    expect(getArtistKpiSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
  });

  it('should call getArtistKpi and return error 404 because the service response empty', async () => {
    const getArtistKpiSpy = jest
      .spyOn(service, 'getArtistKpi')
      .mockImplementation(() => Promise.resolve(null));

    const res = responseMock() as unknown as Response;
    await controller.getArtistKpi(res);

    expect(getArtistKpiSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
  });

  it('should call getArtistRadioStationKpi and return all the artists', async () => {
    const getArtistRadioStationKpiSpy = jest
      .spyOn(service, 'getArtistRadioStationKpi')
      .mockImplementation(() => Promise.resolve(radioStationStadistic));

    const res = responseMock() as unknown as Response;
    const ctrlResp = await controller.getArtistRadioStationKpi(res);

    expect(ctrlResp).toBeDefined();
    expect(getArtistRadioStationKpiSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
  });

  it('should call getArtistRadioStationKpi and return error 404 because the service response empty', async () => {
    const getArtistRadioStationKpiSpy = jest
      .spyOn(service, 'getArtistRadioStationKpi')
      .mockImplementation(() => Promise.resolve(null));

    const res = responseMock() as unknown as Response;
    await controller.getArtistRadioStationKpi(res);

    expect(getArtistRadioStationKpiSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
  });
});
