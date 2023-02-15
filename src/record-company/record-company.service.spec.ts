import { Test, TestingModule } from '@nestjs/testing';
import { CacheModule } from '@nestjs/common';
import { configuration } from './../config/configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { BigqueryModule } from './../bigquery/bigquery.module';

import { RecordCompanyService } from './record-company.service';

import { RECORD_COMPANY_REPOSITORY } from './repository/record-company.repository';
import { MockType } from 'src/bigquery/bigquery.service.spec';

import discograficas from './mock/discograficas.json';
import discografica_id_resumen from './mock/discografica_id_resumen.json';
import discografica_id_kpi_radio from './mock/discografica_id_kpi_radio.json';
import discografica_id_list_artistas from './mock/discografica_id_artists.json';

describe('RecordCompanyService', () => {
  let service: RecordCompanyService;
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
      providers: [
        RecordCompanyService,
        {
          provide: RECORD_COMPANY_REPOSITORY,
          useFactory: () => ({
            findAllRecordCompanies: () => jest.fn(),
            getSummaryRecordCompanyById: () => jest.fn(),
            getRecordCompanyByIdKpiRadio: () => jest.fn(),
            getArtistsRecordCompanyById: () => jest.fn(),
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

    service = module.get<RecordCompanyService>(RecordCompanyService);
    repository = module.get(RECORD_COMPANY_REPOSITORY);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should call findAllRecordCompanies and get all record company response succesfully', async () => {
    const mockServResp = discograficas;
    const findAllRecordCompaniesSpy = jest
      .spyOn(repository, 'findAllRecordCompanies')
      .mockImplementation(() => Promise.resolve(mockServResp));

    const serviceResp = await service.findAllRecordCompanies();

    expect(serviceResp).toEqual(mockServResp);
    expect(findAllRecordCompaniesSpy).toHaveBeenCalled();
  });

  it('should call findAllRecordCompanies and get empty record company response succesfully', async () => {
    const mockServResp = { ...discograficas, discograficas: [] };
    const findAllRecordCompaniesSpy = jest
      .spyOn(repository, 'findAllRecordCompanies')
      .mockImplementation(() => Promise.resolve(mockServResp));

    const serviceResp = await service.findAllRecordCompanies();

    expect(serviceResp).toEqual(mockServResp);
    expect(serviceResp.discograficas.length).toBe(0);
    expect(findAllRecordCompaniesSpy).toHaveBeenCalled();
  });

  it('should call findAllRecordCompanies and get error 500 something happen at repository', async () => {
    const findAllRecordCompaniesSpy = jest
      .spyOn(repository, 'findAllRecordCompanies')
      .mockImplementation(() => Promise.reject(new Error('error 500')));

    try {
      await service.findAllRecordCompanies();
    } catch (error) {
      expect(findAllRecordCompaniesSpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(Error);
      expect(error['status']).toBe(500);
      expect(error['message']).toBe(
        'Error make query in findAllRecordCompanies',
      );
      await expect(service.findAllRecordCompanies()).rejects.toThrowError();
    }
  });

  it('should call getSummaryRecordCompanyById and get the summary record company response succesfully', async () => {
    const recordCompanyIdMock = '1099';
    const mockServResp = discografica_id_resumen[recordCompanyIdMock];
    const getSummaryRecordCompanyByIdSpy = jest
      .spyOn(repository, 'getSummaryRecordCompanyById')
      .mockImplementation(() => Promise.resolve(mockServResp));

    const serviceResp = await service.getSummaryRecordCompanyById(
      recordCompanyIdMock,
    );

    expect(serviceResp).toEqual(mockServResp);
    expect(getSummaryRecordCompanyByIdSpy).toHaveBeenCalled();
  });

  it('should call getSummaryRecordCompanyById and get the summary record company response succesfully but with empty kpisBasicos', async () => {
    const recordCompanyIdMock = '1099';
    const mockServResp = {
      ...discografica_id_resumen[recordCompanyIdMock],
      kpisBasicos: {},
    };
    const getSummaryRecordCompanyByIdSpy = jest
      .spyOn(repository, 'getSummaryRecordCompanyById')
      .mockImplementation(() => Promise.resolve(mockServResp));

    const serviceResp = await service.getSummaryRecordCompanyById(
      recordCompanyIdMock,
    );

    expect(serviceResp).toEqual(mockServResp);
    expect(getSummaryRecordCompanyByIdSpy).toHaveBeenCalled();
  });

  it('should call findAllRecordCompanies and get error 500 something happen at repository', async () => {
    const recordCompanyIdMock = '1099';
    const findAllRecordCompaniesSpy = jest
      .spyOn(repository, 'getSummaryRecordCompanyById')
      .mockImplementation(() => Promise.reject(new Error('error 500')));

    try {
      await service.getSummaryRecordCompanyById(recordCompanyIdMock);
    } catch (error) {
      expect(findAllRecordCompaniesSpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(Error);
      expect(error['status']).toBe(500);
      expect(error['message']).toBe(
        'Error make query getSummaryRecordCompanyById',
      );
      await expect(
        service.getSummaryRecordCompanyById(recordCompanyIdMock),
      ).rejects.toThrowError();
    }
  });

  it('should call getRecordCompanyByIdKpiRadio and get the record company response succesfully', async () => {
    const recordCompanyIdMock = '1099';
    const mockServResp = discografica_id_kpi_radio[recordCompanyIdMock];
    const getRecordCompanyByIdKpiRadioSpy = jest
      .spyOn(repository, 'getRecordCompanyByIdKpiRadio')
      .mockImplementation(() => Promise.resolve(mockServResp));

    const serviceResp = await service.getRecordCompanyByIdKpiRadio(
      recordCompanyIdMock,
    );

    expect(serviceResp).toEqual(mockServResp);
    expect(getRecordCompanyByIdKpiRadioSpy).toHaveBeenCalled();
  });

  it('should call getRecordCompanyByIdKpiRadio and get the record company with an empty KpiRadio response succesfully', async () => {
    const recordCompanyIdMock = '1099';
    const mockServResp = { cobertura: {} };
    const getRecordCompanyByIdKpiRadioSpy = jest
      .spyOn(repository, 'getRecordCompanyByIdKpiRadio')
      .mockImplementation(() => Promise.resolve(mockServResp));

    const serviceResp = await service.getRecordCompanyByIdKpiRadio(
      recordCompanyIdMock,
    );

    expect(serviceResp).toEqual(mockServResp);
    expect(getRecordCompanyByIdKpiRadioSpy).toHaveBeenCalled();
  });

  it('should call getRecordCompanyByIdKpiRadio and get error 500 something happen at repository', async () => {
    const recordCompanyIdMock = '1099';
    const getRecordCompanyByIdKpiRadioSpy = jest
      .spyOn(repository, 'getRecordCompanyByIdKpiRadio')
      .mockImplementation(() => Promise.reject(new Error('error 500')));

    try {
      await service.getRecordCompanyByIdKpiRadio(recordCompanyIdMock);
    } catch (error) {
      expect(getRecordCompanyByIdKpiRadioSpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(Error);
      expect(error['status']).toBe(500);
      expect(error['message']).toBe(
        'Error make query getRecordCompanyByIdKpiRadio',
      );
      await expect(
        service.getRecordCompanyByIdKpiRadio(recordCompanyIdMock),
      ).rejects.toThrowError();
    }
  });

  it('should call getArtistsRecordCompanyById and get the artists list from an specific record company succesfully', async () => {
    const recordCompanyIdMock = '1099';
    const mockServResp = discografica_id_list_artistas[recordCompanyIdMock];
    const getArtistsRecordCompanyByIdSpy = jest
      .spyOn(repository, 'getArtistsRecordCompanyById')
      .mockImplementation(() => Promise.resolve(mockServResp));

    const serviceResp = await service.getArtistsRecordCompanyById(
      recordCompanyIdMock,
    );

    expect(serviceResp).toEqual(mockServResp);
    expect(getArtistsRecordCompanyByIdSpy).toHaveBeenCalled();
  });

  it('should call getArtistsRecordCompanyById and get the artists list empty from an specific record company succesfully', async () => {
    const recordCompanyIdMock = '1099';
    const mockServResp = { artistas: [] };
    const getArtistsRecordCompanyByIdSpy = jest
      .spyOn(repository, 'getArtistsRecordCompanyById')
      .mockImplementation(() => Promise.resolve(mockServResp));

    const serviceResp = await service.getArtistsRecordCompanyById(
      recordCompanyIdMock,
    );

    expect(serviceResp).toEqual(mockServResp);
    expect(getArtistsRecordCompanyByIdSpy).toHaveBeenCalled();
  });

  it('should call getArtistsRecordCompanyById and get error 500 something happen at repository', async () => {
    const recordCompanyIdMock = '1099';
    const getArtistsRecordCompanyByIdSpy = jest
      .spyOn(repository, 'getArtistsRecordCompanyById')
      .mockImplementation(() => Promise.reject(new Error('error 500')));

    try {
      await service.getArtistsRecordCompanyById(recordCompanyIdMock);
    } catch (error) {
      expect(getArtistsRecordCompanyByIdSpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(Error);
      expect(error['status']).toBe(500);
      expect(error['message']).toBe(
        'Error make query getArtistsRecordCompanyById',
      );
      await expect(
        service.getArtistsRecordCompanyById(recordCompanyIdMock),
      ).rejects.toThrowError();
    }
  });
});
