import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/common';
import { BigqueryModule } from './../bigquery/bigquery.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { SongController } from './song.controller';
import { SongService } from './song.service';

import { SONG_REPOSITORY } from './repository/song.repository';

import { configuration } from './../config/configuration';

import canciones_id_resumen from './mock/canciones_id_resumen.json';
import canciones_id_kpi_radio from './mock/canciones_id_kpi_radio.json';
import canciones_id_kpis from './mock/canciones_id_kpis.json';

describe('SongController', () => {
  let controller: SongController;
  let service: SongService;

  const passportModule = PassportModule.register({ defaultStrategy: 'jwt' });
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
      controllers: [SongController],
      providers: [
        SongService,
        {
          provide: SONG_REPOSITORY,
          useFactory: () => ({
            getSummarySongById: () => jest.fn(),
            getKpiRadioSongById: () => jest.fn(),
            getKpisSongById: () => jest.fn(),
          }),
        },
        {
          provide: 'JwtStrategy',
          useFactory: () => ({
            validate: () => jest.fn(),
          }),
        },
      ],
    }).compile();

    controller = module.get<SongController>(SongController);
    service = module.get<SongService>(SongService);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should call getSummarySongById and return summary of specific song', async () => {
    const songIdMock = '10000118971';
    const mockResp = canciones_id_resumen[songIdMock];
    const getSummarySongByIdSpy = jest
      .spyOn(service, 'getSummarySongById')
      .mockImplementation(() => Promise.resolve(mockResp));

    const ctrlResp = await controller.getSummarySongById(songIdMock);

    expect(ctrlResp).toBeDefined();
    expect(getSummarySongByIdSpy).toHaveBeenCalled();
    expect(getSummarySongByIdSpy).toHaveBeenCalledWith(songIdMock);
    expect(ctrlResp).toEqual(mockResp);
  });

  it('should call getSummarySongById and return summary of specific song but with empty kpisBasicos', async () => {
    const songIdMock = '10000118971';
    const mockResp = { ...canciones_id_resumen[songIdMock], kpisBasicos: {} };
    const getSummarySongByIdSpy = jest
      .spyOn(service, 'getSummarySongById')
      .mockImplementation(() => Promise.resolve(mockResp));

    const ctrlResp = await controller.getSummarySongById(songIdMock);

    expect(ctrlResp).toBeDefined();
    expect(getSummarySongByIdSpy).toHaveBeenCalled();
    expect(getSummarySongByIdSpy).toHaveBeenCalledWith(songIdMock);
    expect(ctrlResp).toEqual(mockResp);
  });

  it('should call getSummarySongById and get error 500 something happen at repository', async () => {
    const songIdMock = '10000118971';
    const getSummarySongByIdSpy = jest
      .spyOn(service, 'getSummarySongById')
      .mockImplementation(() => Promise.reject(new Error('error 500')));

    try {
      await controller.getSummarySongById(songIdMock);
    } catch (error) {
      expect(getSummarySongByIdSpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(Error);
      await expect(
        controller.getSummarySongById(songIdMock),
      ).rejects.toThrowError();
    }
  });

  it('should call getKpiRadioSongById and return kpiRadio of specific song', async () => {
    const songIdMock = '10000118971';
    const mockResp = canciones_id_kpi_radio[songIdMock];
    const getKpiRadioSongByIdSpy = jest
      .spyOn(service, 'getKpiRadioSongById')
      .mockImplementation(() => Promise.resolve(mockResp));

    const ctrlResp = await controller.getKpiRadioSongById(songIdMock);

    expect(ctrlResp).toBeDefined();
    expect(getKpiRadioSongByIdSpy).toHaveBeenCalled();
    expect(getKpiRadioSongByIdSpy).toHaveBeenCalledWith(songIdMock);
    expect(ctrlResp).toEqual(mockResp);
  });

  it('should call getKpiRadioSongById and return an empty kpiRadio of specific song', async () => {
    const songIdMock = '10000118971';
    const mockResp = { ...canciones_id_kpi_radio[songIdMock], cobertura: {} };
    const getKpiRadioSongByIdSpy = jest
      .spyOn(service, 'getKpiRadioSongById')
      .mockImplementation(() => Promise.resolve(mockResp));

    const ctrlResp = await controller.getKpiRadioSongById(songIdMock);

    expect(ctrlResp).toBeDefined();
    expect(getKpiRadioSongByIdSpy).toHaveBeenCalled();
    expect(getKpiRadioSongByIdSpy).toHaveBeenCalledWith(songIdMock);
    expect(ctrlResp).toEqual(mockResp);
  });

  it('should call getKpiRadioSongById and get error 500 something happen at repository', async () => {
    const songIdMock = '10000118971';
    const getKpiRadioSongByIdSpy = jest
      .spyOn(service, 'getKpiRadioSongById')
      .mockImplementation(() => Promise.reject(new Error('error 500')));

    try {
      await controller.getKpiRadioSongById(songIdMock);
    } catch (error) {
      expect(getKpiRadioSongByIdSpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(Error);
      await expect(
        controller.getKpiRadioSongById(songIdMock),
      ).rejects.toThrowError();
    }
  });

  it('should call getKpisSongById and return empty kpis of specific song', async () => {
    const songIdMock = '10000118971';
    const mockResp = {
      overview: {},
      impact: {},
    };
    const getKpisSongByIdSpy = jest
      .spyOn(service, 'getKpisSongById')
      .mockImplementation(() => Promise.resolve(mockResp));

    const ctrlResp = await controller.getKpisSongById(songIdMock, undefined);

    expect(ctrlResp).toBeDefined();
    expect(getKpisSongByIdSpy).toHaveBeenCalled();
    expect(getKpisSongByIdSpy).toHaveBeenCalledWith(songIdMock, undefined);
    expect(ctrlResp).toEqual(mockResp);
  });

  it('should call getKpisSongById and return kpis of specific song', async () => {
    const songIdMock = '10000118971';
    const mockResp = canciones_id_kpis[songIdMock];
    const getKpisSongByIdSpy = jest
      .spyOn(service, 'getKpisSongById')
      .mockImplementation(() => Promise.resolve(mockResp));

    const ctrlResp = await controller.getKpisSongById(songIdMock, undefined);

    expect(ctrlResp).toBeDefined();
    expect(getKpisSongByIdSpy).toHaveBeenCalled();
    expect(getKpisSongByIdSpy).toHaveBeenCalledWith(songIdMock, undefined);
    expect(ctrlResp).toEqual(mockResp);
  });

  it('should call getKpisSongById with filter 3M as query params and return kpis of specific song', async () => {
    const songIdMock = '10000118971';
    const filterMock = '3M';
    const mockResp = canciones_id_kpis[songIdMock];
    const getKpisSongByIdSpy = jest
      .spyOn(service, 'getKpisSongById')
      .mockImplementation(() => Promise.resolve(mockResp));

    const ctrlResp = await controller.getKpisSongById(songIdMock, filterMock);

    expect(ctrlResp).toBeDefined();
    expect(getKpisSongByIdSpy).toHaveBeenCalled();
    expect(getKpisSongByIdSpy).toHaveBeenCalledWith(songIdMock, filterMock);
    expect(ctrlResp).toEqual(mockResp);
  });

  it('should call getKpisSongById and get error 500 something happen at repository', async () => {
    const songIdMock = '10000118971';
    const getKpisSongByIdSpy = jest
      .spyOn(service, 'getKpisSongById')
      .mockImplementation(() => Promise.reject(new Error('error 500')));

    try {
      await controller.getKpisSongById(songIdMock, undefined);
    } catch (error) {
      expect(getKpisSongByIdSpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(Error);
      await expect(
        controller.getKpisSongById(songIdMock, undefined),
      ).rejects.toThrowError();
    }
  });
});
