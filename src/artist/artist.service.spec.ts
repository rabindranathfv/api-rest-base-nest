import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { BigqueryModule } from '../bigquery/bigquery.module';

import { ArtistService } from './artist.service';

import { MockType } from 'src/bigquery/bigquery.service.spec';
import { ARTIST_REPOSITORY } from './repository/artist.repository';

import artistas_id_resumen from './mocks/artistas_id_resumen.json';
import artistas_id_canciones from './mocks/artistas_id_canciones.json';
import artistas_id_kpi_radio from './mocks/artistas_id_kpi_radio.json';

describe('ArtistService:::', () => {
  let service: ArtistService;
  let repository: MockType<any>;

  const passportModule = PassportModule.register({ defaultStrategy: 'jwt' });

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
        ArtistService,
        {
          provide: ARTIST_REPOSITORY,
          useFactory: () => ({
            getKpiRadioArtistById: () => jest.fn(),
            getSummaryArtistById: () => jest.fn(),
            getAllSongsByArtistsById: () => jest.fn(),
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

    service = module.get<ArtistService>(ArtistService);
    repository = module.get(ARTIST_REPOSITORY);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should call getSummaryArtistById and return summary info for the artist', async () => {
    const artistIdMock = '10000039078';
    const mockServResp = artistas_id_resumen[artistIdMock];
    const getSummaryArtistByIdSpy = jest
      .spyOn(repository, 'getSummaryArtistById')
      .mockImplementation(() => Promise.resolve(mockServResp));

    const serviceResp = await service.getSummaryArtistById(artistIdMock);

    expect(serviceResp).toEqual(mockServResp);
    expect(getSummaryArtistByIdSpy).toHaveBeenCalled();
  });

  it('should call getSummaryArtistById and return empty summary info for the artist', async () => {
    const artistIdMock = '10000039078';
    const getSummaryArtistByIdSpy = jest
      .spyOn(repository, 'getSummaryArtistById')
      .mockImplementation(() => Promise.resolve({}));

    const serviceResp = await service.getSummaryArtistById(artistIdMock);

    expect(serviceResp).toEqual({});
    expect(getSummaryArtistByIdSpy).toHaveBeenCalled();
  });

  it('should call getSummaryArtistById and return 500 exception because some error happens after repository response', async () => {
    const artistIdMock = '10000039078';
    const getSummaryArtistByIdSpy = jest
      .spyOn(repository, 'getSummaryArtistById')
      .mockImplementation(() => {
        throw new Error('error 500');
      });

    try {
      await service.getSummaryArtistById(artistIdMock);
    } catch (error) {
      expect(getSummaryArtistByIdSpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(Error);
      expect(error['status']).toBe(500);
    }
  });

  it('should call getAllSongsByArtistsById and return the songs by an specific artist', async () => {
    const artistIdMock = '10000039078';
    const mockServResp = artistas_id_canciones[artistIdMock];
    const getAllSongsByArtistsByIdSpy = jest
      .spyOn(repository, 'getAllSongsByArtistsById')
      .mockImplementation(() => Promise.resolve(mockServResp));

    const serviceResp = await service.getAllSongsByArtistsById(artistIdMock);

    expect(serviceResp).toEqual(mockServResp);
    expect(getAllSongsByArtistsByIdSpy).toHaveBeenCalled();
  });

  it('should call getAllSongsByArtistsById and return 500 exception because some error happens after repository response', async () => {
    const artistIdMock = '10000039078';
    const getAllSongsByArtistsByIdSpy = jest
      .spyOn(repository, 'getAllSongsByArtistsById')
      .mockImplementation(() => {
        throw new Error('error 500');
      });

    try {
      await service.getAllSongsByArtistsById(artistIdMock);
    } catch (error) {
      expect(getAllSongsByArtistsByIdSpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(Error);
      expect(error['status']).toBe(500);
    }
  });

  it('should call getAllSongsByArtistsById and return the empty songs array by an specific artist', async () => {
    const artistIdMock = '10000039078';
    const mockServResp = { canciones: [] };
    const getAllSongsByArtistsByIdSpy = jest
      .spyOn(repository, 'getAllSongsByArtistsById')
      .mockImplementation(() => Promise.resolve({ canciones: [] }));

    const serviceResp = await service.getAllSongsByArtistsById(artistIdMock);

    expect(serviceResp).toEqual(mockServResp);
    expect(getAllSongsByArtistsByIdSpy).toHaveBeenCalled();
  });

  it('should call getKpiRadioArtistById and return the kpi radio of an specific artist', async () => {
    const artistIdMock = '10000039078';
    const mockServResp = artistas_id_kpi_radio[artistIdMock];
    const getKpiRadioArtistByIdSpy = jest
      .spyOn(repository, 'getKpiRadioArtistById')
      .mockImplementation(() => Promise.resolve(mockServResp));

    const serviceResp = await service.getKpiRadioArtistById(artistIdMock);

    expect(serviceResp).toEqual(mockServResp);
    expect(getKpiRadioArtistByIdSpy).toHaveBeenCalled();
  });

  it('should call getKpiRadioArtistById and return 500 exception because some error happens after repository response', async () => {
    const artistIdMock = '10000039078';
    const getKpiRadioArtistByIdSpy = jest
      .spyOn(repository, 'getKpiRadioArtistById')
      .mockImplementation(() => {
        throw new Error('error 500');
      });

    try {
      await service.getKpiRadioArtistById(artistIdMock);
    } catch (error) {
      expect(getKpiRadioArtistByIdSpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(Error);
      expect(error['status']).toBe(500);
    }
  });

  it('should call getKpiRadioArtistById and return empty kpi radio of an specific artist', async () => {
    const artistIdMock = '10000039078';
    const mockServResp = { cobertura: {} };
    const getKpiRadioArtistByIdSpy = jest
      .spyOn(repository, 'getKpiRadioArtistById')
      .mockImplementation(() => Promise.resolve(mockServResp));

    const serviceResp = await service.getKpiRadioArtistById(artistIdMock);

    expect(serviceResp).toEqual(mockServResp);
    expect(getKpiRadioArtistByIdSpy).toHaveBeenCalled();
  });
});
