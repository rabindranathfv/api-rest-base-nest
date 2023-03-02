import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/common';
import { BigqueryModule } from './../bigquery/bigquery.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { SongService } from './song.service';

import { MockType } from 'src/bigquery/bigquery.service.spec';
import { SONG_REPOSITORY } from './repository/song.repository';

import { configuration } from './../config/configuration';

import canciones_id_resumen from './mock/canciones_id_resumen.json';
import canciones_id_kpi_radio from './mock/canciones_id_kpi_radio.json';
import canciones_id_kpis from './mock/canciones_id_kpis.json';

describe('SongService', () => {
  let service: SongService;
  let repository: MockType<any>;

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

    service = module.get<SongService>(SongService);
    repository = module.get(SONG_REPOSITORY);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  it('should call getSummarySongById and return summary of specific song', async () => {
    const songIdMock = '10000118971';
    const mockResp = canciones_id_resumen[songIdMock];
    const getSummarySongByIdSpy = jest
      .spyOn(repository, 'getSummarySongById')
      .mockImplementation(() => Promise.resolve(mockResp));

    const serviceResp = await service.getSummarySongById(songIdMock);

    expect(serviceResp).toBeDefined();
    expect(getSummarySongByIdSpy).toHaveBeenCalled();
    expect(getSummarySongByIdSpy).toHaveBeenCalledWith(songIdMock);
    expect(serviceResp).toEqual(mockResp);
  });

  it('should call getSummarySongById and return summary of specific song but with empty kpisBasicos', async () => {
    const songIdMock = '10000118971';
    const mockResp = { ...canciones_id_resumen[songIdMock], kpisBasicos: {} };
    const getSummarySongByIdSpy = jest
      .spyOn(repository, 'getSummarySongById')
      .mockImplementation(() => Promise.resolve(mockResp));

    const serviceResp = await service.getSummarySongById(songIdMock);

    expect(serviceResp).toBeDefined();
    expect(getSummarySongByIdSpy).toHaveBeenCalled();
    expect(getSummarySongByIdSpy).toHaveBeenCalledWith(songIdMock);
    expect(serviceResp).toEqual(mockResp);
  });

  it('should call getSummarySongById and get error 500 something happen at repository', async () => {
    const songIdMock = '10000118971';
    const getSummarySongByIdSpy = jest
      .spyOn(repository, 'getSummarySongById')
      .mockImplementation(() => Promise.reject(new Error('error 500')));

    try {
      await service.getSummarySongById(songIdMock);
    } catch (error) {
      expect(getSummarySongByIdSpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(Error);
      expect(error['status']).toBe(500);
      expect(error['message']).toBe('Error make query getSummarySongById');
      await expect(
        service.getSummarySongById(songIdMock),
      ).rejects.toThrowError();
    }
  });

  it('should call getKpiRadioSongById and return kpiRadio of specific song', async () => {
    const songIdMock = '10000118971';
    const mockResp = canciones_id_kpi_radio[songIdMock];
    const getKpiRadioSongByIdSpy = jest
      .spyOn(repository, 'getKpiRadioSongById')
      .mockImplementation(() => Promise.resolve(mockResp));

    const serviceResp = await service.getKpiRadioSongById(songIdMock);

    expect(serviceResp).toBeDefined();
    expect(getKpiRadioSongByIdSpy).toHaveBeenCalled();
    expect(getKpiRadioSongByIdSpy).toHaveBeenCalledWith(songIdMock);
    expect(serviceResp).toEqual(mockResp);
  });

  it('should call getKpiRadioSongById and return an empty kpiRadio of specific song', async () => {
    const songIdMock = '10000118971';
    const mockResp = { ...canciones_id_kpi_radio[songIdMock], cobertura: {} };
    const getKpiRadioSongByIdSpy = jest
      .spyOn(repository, 'getKpiRadioSongById')
      .mockImplementation(() => Promise.resolve(mockResp));

    const serviceResp = await service.getKpiRadioSongById(songIdMock);

    expect(serviceResp).toBeDefined();
    expect(getKpiRadioSongByIdSpy).toHaveBeenCalled();
    expect(getKpiRadioSongByIdSpy).toHaveBeenCalledWith(songIdMock);
    expect(serviceResp).toEqual(mockResp);
  });

  it('should call getKpiRadioSongById and get error 500 something happen at repository', async () => {
    const songIdMock = '10000118971';
    const getKpiRadioSongByIdSpy = jest
      .spyOn(repository, 'getKpiRadioSongById')
      .mockImplementation(() => Promise.reject(new Error('error 500')));

    try {
      await service.getKpiRadioSongById(songIdMock);
    } catch (error) {
      expect(getKpiRadioSongByIdSpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(Error);
      expect(error['status']).toBe(500);
      expect(error['message']).toBe('Error make query getKpiRadioSongById');
      await expect(
        service.getKpiRadioSongById(songIdMock),
      ).rejects.toThrowError();
    }
  });

  it('should call getKpisSongById with no query param filter and return empty kpis of specific song', async () => {
    const songIdMock = '10000118971';
    const mockResp = {
      overview: {},
      impact: {},
    };
    const getKpisSongByIdSpy = jest
      .spyOn(repository, 'getKpisSongById')
      .mockImplementation(() => Promise.resolve(mockResp));

    const serviceResp = await service.getKpisSongById(songIdMock, undefined);

    expect(serviceResp).toBeDefined();
    expect(getKpisSongByIdSpy).toHaveBeenCalled();
    expect(getKpisSongByIdSpy).toHaveBeenCalledWith(songIdMock, '');
    expect(serviceResp).toEqual(mockResp);
  });

  it('should call getKpisSongById with query param filter and return empty kpis of specific song', async () => {
    const songIdMock = '10000118971';
    const filterMock = '3M';
    const mockResp = {
      overview: {},
      impact: {},
    };
    const getKpisSongByIdSpy = jest
      .spyOn(repository, 'getKpisSongById')
      .mockImplementation(() => Promise.resolve(mockResp));

    const serviceResp = await service.getKpisSongById(songIdMock, filterMock);

    expect(serviceResp).toBeDefined();
    expect(getKpisSongByIdSpy).toHaveBeenCalled();
    expect(getKpisSongByIdSpy).toHaveBeenCalledWith(songIdMock, filterMock);
    expect(serviceResp).toEqual(mockResp);
  });

  it('should call getKpisSongById with no query param filter and return kpis of specific song', async () => {
    const songIdMock = '10000118971';
    const mockResp = canciones_id_kpis[songIdMock];
    const getKpisSongByIdSpy = jest
      .spyOn(repository, 'getKpisSongById')
      .mockImplementation(() => Promise.resolve(mockResp));

    const serviceResp = await service.getKpisSongById(songIdMock, undefined);

    expect(serviceResp).toBeDefined();
    expect(getKpisSongByIdSpy).toHaveBeenCalled();
    expect(getKpisSongByIdSpy).toHaveBeenCalledWith(songIdMock, '');
    expect(serviceResp).toEqual(mockResp);
  });

  it('should call getKpisSongById with query param for filter and return kpis of specific song', async () => {
    const songIdMock = '10000118971';
    const filterMock = '6M';
    const mockResp = canciones_id_kpis[songIdMock];
    const getKpisSongByIdSpy = jest
      .spyOn(repository, 'getKpisSongById')
      .mockImplementation(() => Promise.resolve(mockResp));

    const serviceResp = await service.getKpisSongById(songIdMock, filterMock);

    expect(serviceResp).toBeDefined();
    expect(getKpisSongByIdSpy).toHaveBeenCalled();
    expect(getKpisSongByIdSpy).toHaveBeenCalledWith(songIdMock, filterMock);
    expect(serviceResp).toEqual(mockResp);
  });

  it('should call getKpisSongById and get error 500 something happen at repository', async () => {
    const songIdMock = '10000118971';
    const getKpisSongByIdSpy = jest
      .spyOn(repository, 'getKpisSongById')
      .mockImplementation(() => Promise.reject(new Error('error 500')));

    try {
      await service.getKpisSongById(songIdMock);
    } catch (error) {
      expect(getKpisSongByIdSpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(Error);
      expect(error['status']).toBe(500);
      expect(error['message']).toBe('Error make query getKpisSongById');
      await expect(service.getKpisSongById(songIdMock)).rejects.toThrowError();
    }
  });
});
