import { Test, TestingModule } from '@nestjs/testing';
import { CacheModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { BigqueryModule } from './../bigquery/bigquery.module';

import { RecordCompanyService } from './record-company.service';
import { RecordCompanyController } from './record-company.controller';

import { configuration } from './../config/configuration';
import { RECORD_COMPANY_REPOSITORY } from './repository/record-company.repository';

import discograficas from './mock/discograficas.json';
import discografica_id_resumen from './mock/discografica_id_resumen.json';
import discografica_id_kpi_radio from './mock/discografica_id_kpi_radio.json';
import discografica_id_list_artistas from './mock/discografica_id_artists.json';

describe('RecordCompanyController', () => {
  let controller: RecordCompanyController;
  let service: RecordCompanyService;

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
      controllers: [RecordCompanyController],
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

    controller = module.get<RecordCompanyController>(RecordCompanyController);
    service = module.get<RecordCompanyService>(RecordCompanyService);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should call findAllRecordCompanies with no query params and get all record company response succesfully', async () => {
    const mockServResp = discograficas;
    const findAllRecordCompaniesSpy = jest
      .spyOn(service, 'findAllRecordCompanies')
      .mockImplementation(() => Promise.resolve(mockServResp));

    const ctrlResp = await controller.findAllRecordCompanies(
      undefined,
      undefined,
    );

    expect(ctrlResp).toEqual(mockServResp);
    expect(findAllRecordCompaniesSpy).toHaveBeenCalled();
  });

  it('should call findAllRecordCompanies with query params filter and searchText and get all record company response succesfully', async () => {
    const mockServResp = discograficas;
    const filterMock = '3M';
    const searchTextMock = 'BIt Music';
    const findAllRecordCompaniesSpy = jest
      .spyOn(service, 'findAllRecordCompanies')
      .mockImplementation(() => Promise.resolve(mockServResp));

    const ctrlResp = await controller.findAllRecordCompanies(
      filterMock,
      searchTextMock,
    );

    expect(ctrlResp).toEqual(mockServResp);
    expect(findAllRecordCompaniesSpy).toHaveBeenCalled();
  });

  it('should call findAllRecordCompanies with no query params and get empty record company response succesfully', async () => {
    const mockServResp = { ...discograficas, discograficas: [] };
    const findAllRecordCompaniesSpy = jest
      .spyOn(service, 'findAllRecordCompanies')
      .mockImplementation(() => Promise.resolve(mockServResp));

    const ctrlResp = await controller.findAllRecordCompanies(
      undefined,
      undefined,
    );

    expect(ctrlResp).toEqual(mockServResp);
    expect(ctrlResp.discograficas.length).toBe(0);
    expect(findAllRecordCompaniesSpy).toHaveBeenCalled();
  });

  it('should call findAllRecordCompanies with query params filter and get empty record company response succesfully', async () => {
    const mockServResp = { ...discograficas, discograficas: [] };
    const filterMock = '6M';
    const findAllRecordCompaniesSpy = jest
      .spyOn(service, 'findAllRecordCompanies')
      .mockImplementation(() => Promise.resolve(mockServResp));

    const ctrlResp = await controller.findAllRecordCompanies(
      filterMock,
      undefined,
    );

    expect(ctrlResp).toEqual(mockServResp);
    expect(ctrlResp.discograficas.length).toBe(0);
    expect(findAllRecordCompaniesSpy).toHaveBeenCalled();
  });

  it('should call findAllRecordCompanies with no query params and get error 500 something happen at repository', async () => {
    const findAllRecordCompaniesSpy = jest
      .spyOn(service, 'findAllRecordCompanies')
      .mockImplementation(() => Promise.reject(new Error('error 500')));

    try {
      await controller.findAllRecordCompanies(undefined, undefined);
    } catch (error) {
      expect(findAllRecordCompaniesSpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(Error);
      await expect(
        controller.findAllRecordCompanies(undefined, undefined),
      ).rejects.toThrowError();
    }
  });

  it('should call findAllRecordCompanies with query params searchText and get error 500 something happen at repository', async () => {
    const searchText = 'Bit Music';
    const findAllRecordCompaniesSpy = jest
      .spyOn(service, 'findAllRecordCompanies')
      .mockImplementation(() => Promise.reject(new Error('error 500')));

    try {
      await controller.findAllRecordCompanies(undefined, searchText);
    } catch (error) {
      expect(findAllRecordCompaniesSpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(Error);
      await expect(
        controller.findAllRecordCompanies(undefined, searchText),
      ).rejects.toThrowError();
    }
  });

  it('should call getSummaryRecordCompanyById and get the summary record company response succesfully', async () => {
    const recordCompanyIdMock = '1099';
    const mockServResp = discografica_id_resumen[recordCompanyIdMock];
    const getSummaryRecordCompanyByIdSpy = jest
      .spyOn(service, 'getSummaryRecordCompanyById')
      .mockImplementation(() => Promise.resolve(mockServResp));

    const ctrlResp = await controller.getSummaryRecordCompanyById(
      recordCompanyIdMock,
    );

    expect(ctrlResp).toEqual(mockServResp);
    expect(getSummaryRecordCompanyByIdSpy).toHaveBeenCalled();
  });

  it('should call getSummaryRecordCompanyById and get the summary record company response succesfully but with empty kpisBasicos', async () => {
    const recordCompanyIdMock = '1099';
    const mockServResp = {
      ...discografica_id_resumen[recordCompanyIdMock],
      kpisBasicos: {},
    };
    const getSummaryRecordCompanyByIdSpy = jest
      .spyOn(service, 'getSummaryRecordCompanyById')
      .mockImplementation(() => Promise.resolve(mockServResp));

    const ctrlResp = await controller.getSummaryRecordCompanyById(
      recordCompanyIdMock,
    );

    expect(ctrlResp).toEqual(mockServResp);
    expect(getSummaryRecordCompanyByIdSpy).toHaveBeenCalled();
  });

  it('should call findAllRecordCompanies and get error 500 something happen at repository', async () => {
    const recordCompanyIdMock = '1099';
    const findAllRecordCompaniesSpy = jest
      .spyOn(service, 'getSummaryRecordCompanyById')
      .mockImplementation(() => Promise.reject(new Error('error 500')));

    try {
      await controller.getSummaryRecordCompanyById(recordCompanyIdMock);
    } catch (error) {
      expect(findAllRecordCompaniesSpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(Error);
      await expect(
        controller.getSummaryRecordCompanyById(recordCompanyIdMock),
      ).rejects.toThrowError();
    }
  });

  it('should call getRecordCompanyByIdKpiRadio and get the record company response succesfully', async () => {
    const recordCompanyIdMock = '1099';
    const mockServResp = discografica_id_kpi_radio[recordCompanyIdMock];
    const getRecordCompanyByIdKpiRadioSpy = jest
      .spyOn(service, 'getRecordCompanyByIdKpiRadio')
      .mockImplementation(() => Promise.resolve(mockServResp));

    const ctrlResp = await controller.getRecordCompanyByIdKpiRadio(
      recordCompanyIdMock,
    );

    expect(ctrlResp).toEqual(mockServResp);
    expect(getRecordCompanyByIdKpiRadioSpy).toHaveBeenCalled();
  });

  it('should call getRecordCompanyByIdKpiRadio and get the record company with an empty KpiRadio response succesfully', async () => {
    const recordCompanyIdMock = '1099';
    const mockServResp = { cobertura: {} };
    const getRecordCompanyByIdKpiRadioSpy = jest
      .spyOn(service, 'getRecordCompanyByIdKpiRadio')
      .mockImplementation(() => Promise.resolve(mockServResp));

    const ctrlResp = await controller.getRecordCompanyByIdKpiRadio(
      recordCompanyIdMock,
    );

    expect(ctrlResp).toEqual(mockServResp);
    expect(getRecordCompanyByIdKpiRadioSpy).toHaveBeenCalled();
  });

  it('should call getRecordCompanyByIdKpiRadio and get error 500 something happen at repository', async () => {
    const recordCompanyIdMock = '1099';
    const getRecordCompanyByIdKpiRadioSpy = jest
      .spyOn(service, 'getRecordCompanyByIdKpiRadio')
      .mockImplementation(() => Promise.reject(new Error('error 500')));

    try {
      await controller.getRecordCompanyByIdKpiRadio(recordCompanyIdMock);
    } catch (error) {
      expect(getRecordCompanyByIdKpiRadioSpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(Error);
      await expect(
        controller.getRecordCompanyByIdKpiRadio(recordCompanyIdMock),
      ).rejects.toThrowError();
    }
  });

  it('should call getArtistsRecordCompanyById with no query params and get the artists list from an specific record company succesfully', async () => {
    const recordCompanyIdMock = '1099';
    const mockServResp = discografica_id_list_artistas[recordCompanyIdMock];
    const getArtistsRecordCompanyByIdSpy = jest
      .spyOn(service, 'getArtistsRecordCompanyById')
      .mockImplementation(() => Promise.resolve(mockServResp));

    const ctrlResp = await controller.getArtistsRecordCompanyById(
      recordCompanyIdMock,
      undefined,
      undefined,
    );

    expect(ctrlResp).toEqual(mockServResp);
    expect(getArtistsRecordCompanyByIdSpy).toHaveBeenCalled();
  });

  it('should call getArtistsRecordCompanyById with query params and get the artists list from an specific record company succesfully', async () => {
    const recordCompanyIdMock = '1099';
    const filterMock = '3M';
    const searchText = 'karol G';
    const mockServResp = discografica_id_list_artistas[recordCompanyIdMock];
    const getArtistsRecordCompanyByIdSpy = jest
      .spyOn(service, 'getArtistsRecordCompanyById')
      .mockImplementation(() => Promise.resolve(mockServResp));

    const ctrlResp = await controller.getArtistsRecordCompanyById(
      recordCompanyIdMock,
      filterMock,
      searchText,
    );

    expect(ctrlResp).toEqual(mockServResp);
    expect(getArtistsRecordCompanyByIdSpy).toHaveBeenCalled();
  });

  it('should call getArtistsRecordCompanyById with no query params and get the artists list empty from an specific record company succesfully', async () => {
    const recordCompanyIdMock = '1099';
    const mockServResp = { artistas: [] };
    const getArtistsRecordCompanyByIdSpy = jest
      .spyOn(service, 'getArtistsRecordCompanyById')
      .mockImplementation(() => Promise.resolve(mockServResp));

    const ctrlResp = await controller.getArtistsRecordCompanyById(
      recordCompanyIdMock,
      undefined,
      undefined,
    );

    expect(ctrlResp).toEqual(mockServResp);
    expect(getArtistsRecordCompanyByIdSpy).toHaveBeenCalled();
  });

  it('should call getArtistsRecordCompanyById with no query params and get error 500 something happen at repository', async () => {
    const recordCompanyIdMock = '1099';
    const getArtistsRecordCompanyByIdSpy = jest
      .spyOn(service, 'getArtistsRecordCompanyById')
      .mockImplementation(() => Promise.reject(new Error('error 500')));

    try {
      await controller.getArtistsRecordCompanyById(
        recordCompanyIdMock,
        undefined,
        undefined,
      );
    } catch (error) {
      expect(getArtistsRecordCompanyByIdSpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(Error);
      await expect(
        controller.getArtistsRecordCompanyById(
          recordCompanyIdMock,
          undefined,
          undefined,
        ),
      ).rejects.toThrowError();
    }
  });

  it('should call getArtistsRecordCompanyById with query params  filterand get error 500 something happen at repository', async () => {
    const recordCompanyIdMock = '1099';
    const filterMock = '1YR';
    const getArtistsRecordCompanyByIdSpy = jest
      .spyOn(service, 'getArtistsRecordCompanyById')
      .mockImplementation(() => Promise.reject(new Error('error 500')));

    try {
      await controller.getArtistsRecordCompanyById(
        recordCompanyIdMock,
        filterMock,
        undefined,
      );
    } catch (error) {
      expect(getArtistsRecordCompanyByIdSpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(Error);
      await expect(
        controller.getArtistsRecordCompanyById(
          recordCompanyIdMock,
          filterMock,
          undefined,
        ),
      ).rejects.toThrowError();
    }
  });
});
