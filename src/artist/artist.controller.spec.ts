import { Test, TestingModule } from '@nestjs/testing';
import { CacheModule, HttpStatus } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';

import { BIG_QUERY_REPOSITORY } from './../bigquery/repository/big-query.repository';
import { BigQueryAdapterRepository } from '../bigquery/repository/big-query-adapter.repository';
import { ARTIST_REPOSITORY } from './repository/artist.repository';
import { configuration } from '../config/configuration';

import artistas_id_resumen from './mocks/artistas_id_resumen.json';
import artistas_id_canciones from './mocks/artistas_id_canciones.json';
import artistas_id_kpi_radio from './mocks/artistas_id_kpi_radio.json';
import artistas from './mocks/artistas.json';

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

  const passportModule = PassportModule.register({ defaultStrategy: 'jwt' });

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
          provide: ARTIST_REPOSITORY,
          useFactory: () => ({
            getKpiRadioArtistById: () => jest.fn(),
            getSummaryArtistById: () => jest.fn(),
            getAllSongsByArtistsById: () => jest.fn(),
            getAllArtists: () => jest.fn(),
          }),
        },
        {
          provide: 'JwtStrategy',
          useFactory: () => ({
            validate: () => jest.fn(),
          }),
        },
        {
          provide: BIG_QUERY_REPOSITORY,
          useClass: BigQueryAdapterRepository,
        },
      ],
      exports: [passportModule],
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

  it('should call getAllSongsByArtistsById and return the songs of this artist', async () => {
    const idArtistsMock = '10000039078';
    const mockServResp = artistas_id_canciones[idArtistsMock];
    const getAllSongsByArtistsByIdSpy = jest
      .spyOn(service, 'getAllSongsByArtistsById')
      .mockImplementation(async () => Promise.resolve(mockServResp));

    const res = responseMock() as unknown as Response;
    const ctrlResp = await controller.getAllSongsByArtistsById(
      res,
      idArtistsMock,
    );

    expect(ctrlResp).toBeDefined();
    expect(getAllSongsByArtistsByIdSpy).toHaveBeenCalled();
    // await expect(ctrlResp).resolves.toEqual(mockServResp);
    expect(res.status).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
  });

  it('should call getAllSongsByArtistsByIdSpy and return error 404 because the service response empty', async () => {
    const idArtistsMock = '10000039078';
    const getAllSongsByArtistsByIdSpy = jest
      .spyOn(service, 'getAllSongsByArtistsById')
      .mockImplementation(() => Promise.resolve(null));

    const res = responseMock() as unknown as Response;
    await controller.getAllSongsByArtistsById(res, idArtistsMock);

    expect(getAllSongsByArtistsByIdSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
  });

  it('should call getAllSongsByArtistsByIdSpy and return error 500 because something wrong happen in the service', async () => {
    const idArtistsMock = '10000039078';
    const getAllSongsByArtistsByIdSpy = jest
      .spyOn(service, 'getAllSongsByArtistsById')
      .mockImplementation(() => Promise.reject(new Error('error 500')));

    const res = responseMock() as unknown as Response;
    try {
      await controller.getAllSongsByArtistsById(res, idArtistsMock);
    } catch (error) {
      expect(getAllSongsByArtistsByIdSpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(Error);
      await expect(
        controller.getAllSongsByArtistsById(res, idArtistsMock),
      ).rejects.toThrowError(Error);
    }
  });

  it('should call getSummaryArtistById and return the summary of an specific artists', async () => {
    const idArtistsMock = '10000039078';
    const mockServResp = artistas_id_resumen[idArtistsMock];
    const getSummaryArtistByIdSpy = jest
      .spyOn(service, 'getSummaryArtistById')
      .mockImplementation(() => Promise.resolve(mockServResp));

    const res = responseMock() as unknown as Response;
    const ctrlResp = await controller.getSummaryArtistById(res, idArtistsMock);

    expect(ctrlResp).toBeDefined();
    expect(getSummaryArtistByIdSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
  });

  it('should call getSummaryArtistById and return error 404 because the service response empty', async () => {
    const idArtistsMock = '10000039078';
    const getAllSongsByArtistsSpy = jest
      .spyOn(service, 'getSummaryArtistById')
      .mockImplementation(() => Promise.resolve(null));

    const res = responseMock() as unknown as Response;
    await controller.getSummaryArtistById(res, idArtistsMock);

    expect(getAllSongsByArtistsSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
  });

  it('should call getSummaryArtistById and return error 500 because because something wrong happen in the service', async () => {
    const idArtistsMock = '10000039078';
    const getAllSongsByArtistsSpy = jest
      .spyOn(service, 'getSummaryArtistById')
      .mockImplementation(() => Promise.reject(new Error('error 500')));

    const res = responseMock() as unknown as Response;
    try {
      await controller.getSummaryArtistById(res, idArtistsMock);
    } catch (error) {
      expect(getAllSongsByArtistsSpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(Error);
      await expect(
        controller.getSummaryArtistById(res, idArtistsMock),
      ).rejects.toThrowError(Error);
    }
  });

  it('should call getKpiRadioArtistById and return the KpiRadio of specific artist', async () => {
    const idArtistsMock = '10000039078';
    const mockServResp = artistas_id_kpi_radio[idArtistsMock];
    const getKpiRadioArtistByIdSpy = jest
      .spyOn(service, 'getKpiRadioArtistById')
      .mockImplementation(() => Promise.resolve(mockServResp));

    const res = responseMock() as unknown as Response;
    const ctrlResp = await controller.getKpiRadioArtistById(res, idArtistsMock);

    expect(ctrlResp).toBeDefined();
    expect(getKpiRadioArtistByIdSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
  });

  it('should call getArtistRadioStationKpi and return error 404 because the service response empty', async () => {
    const idArtistsMock = '10000039078';
    const getKpiRadioArtistByIdSpy = jest
      .spyOn(service, 'getKpiRadioArtistById')
      .mockImplementation(() => Promise.resolve(null));

    const res = responseMock() as unknown as Response;
    await controller.getKpiRadioArtistById(res, idArtistsMock);

    expect(getKpiRadioArtistByIdSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
  });

  it('should call getKpiRadioArtistById and return error 500 because because something wrong happen in the service', async () => {
    const idArtistsMock = '10000039078';
    const getKpiRadioArtistByIdSpy = jest
      .spyOn(service, 'getKpiRadioArtistById')
      .mockImplementation(() => Promise.reject(new Error('error 500')));

    const res = responseMock() as unknown as Response;
    try {
      await controller.getKpiRadioArtistById(res, idArtistsMock);
    } catch (error) {
      expect(getKpiRadioArtistByIdSpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(Error);
      await expect(
        controller.getKpiRadioArtistById(res, idArtistsMock),
      ).rejects.toThrowError(Error);
    }
  });

  it('should call getAllArtists and return the KpiRadio of specific artist', async () => {
    const mockServResp = artistas;
    const getAllArtistsSpy = jest
      .spyOn(service, 'getAllArtists')
      .mockImplementation(() => Promise.resolve(mockServResp));

    const ctrlResp = await controller.getAllArtists();

    expect(ctrlResp).toBeDefined();
    expect(getAllArtistsSpy).toHaveBeenCalled();
  });

  it('should call getAllArtists and return error 500 because because something wrong happen in the service', async () => {
    const getAllArtistsSpy = jest
      .spyOn(service, 'getAllArtists')
      .mockImplementation(() => Promise.reject(new Error('error 500')));

    try {
      await controller.getAllArtists();
    } catch (error) {
      expect(getAllArtistsSpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(Error);
      await expect(controller.getAllArtists()).rejects.toThrowError(Error);
    }
  });
});
