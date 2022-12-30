import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BigqueryService } from './bigquery.service';
import { BIG_QUERY_REPOSITORY } from './repository/big-query.repository';

describe('BigqueryService:::', () => {
  let service: BigqueryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BigqueryService,
        {
          provide: BIG_QUERY_REPOSITORY,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<BigqueryService>(BigqueryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be call check and provide some results with specific query from bigQuery', async () => {
    const queryResultMock = [
      {
        emisora_N1: 'Los 40',
        emisora_N2: 'Los 40',
        id_interprete: 10000074802,
        interprete_colaboradores: 'Karol G',
        nombre_interprete: 'Karol G',
        inserciones: 1687,
        universo: 5342705.113900277,
        cobertura: 1210211.9462833314,
        cob: 22.651670277191357,
        contactos: 82948882.24369016,
        grp_s: 1552.563363976042,
        ots: 68.54078948603471,
        ola: 'EGM 1ª Ola 2022',
        fecha_peticion: {
          value: '2022-07-02',
        },
        rango: '14-24',
        rango_sort_order: 1,
        fecha: {
          value: '2022-06-30',
        },
      },
      {
        emisora_N1: 'Los 40',
        emisora_N2: 'Los 40',
        id_interprete: 10000081699,
        interprete_colaboradores: 'Camilo',
        nombre_interprete: 'Camilo',
        inserciones: 1118,
        universo: 5342705.113900277,
        cobertura: 1208461.7846627946,
        cob: 22.61891230939741,
        contactos: 56158836.01021249,
        grp_s: 1051.1311182813058,
        ots: 46.471337962816,
        ola: 'EGM 1ª Ola 2022',
        fecha_peticion: {
          value: '2022-07-02',
        },
        rango: '14-24',
        rango_sort_order: 1,
        fecha: {
          value: '2022-06-30',
        },
      },
    ];
    const loggerMsj = `checkDatastore BigQuery Service`;

    const loggerMock = jest
      .spyOn((service as any).logger, 'log')
      .mockReturnValueOnce(loggerMsj);
    const checkSpy = jest.spyOn(service, 'check').mockImplementation(() => {
      return Promise.resolve(queryResultMock);
    });

    service['logger'].log(loggerMsj);
    const queryRes = await service.check();

    expect(service).toBeDefined();
    expect(checkSpy).toHaveBeenCalled();
    expect(loggerMock).toBeCalledWith(loggerMsj);
    expect(queryRes).toEqual(queryResultMock);
  });

  it('should be call check and get ERROR with specific query from bigQuery', async () => {
    const errorMsg = 'Error make query';
    const checkSpy = jest.spyOn(service, 'check').mockImplementation(() => {
      throw new HttpException(errorMsg, HttpStatus.INTERNAL_SERVER_ERROR);
    });

    try {
      await service.check();
    } catch (error) {
      expect(service).toBeDefined();
      expect(checkSpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(Error);
      expect(error['status']).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(error['response']).toBe(errorMsg);
    }
  });

  it('should be call checkDatastore and provide some results with specific query from bigQuery', async () => {
    const queryResultMock = [
      {
        created: '2022-12-19T10:57:11.008Z',
        description: 'some description',
        done: false,
      },
      {
        done: false,
        description: 'some description',
        created: '2022-12-19T11:08:12.390Z',
      },
    ];

    const checkDatastoreSpy = jest
      .spyOn(service, 'checkDatastore')
      .mockImplementation(() => {
        return Promise.resolve(queryResultMock);
      });

    const queryRes = await service.checkDatastore();

    expect(service).toBeDefined();
    expect(checkDatastoreSpy).toHaveBeenCalled();
    expect(queryRes).toEqual(queryResultMock);
  });

  it('should be call checkDatastore and get ERROR with specific query from bigQuery', async () => {
    const errorMsg = 'Error make query';
    const checkDatastoreSpy = jest
      .spyOn(service, 'checkDatastore')
      .mockImplementation(() => {
        throw new HttpException(errorMsg, HttpStatus.INTERNAL_SERVER_ERROR);
      });

    try {
      await service.checkDatastore();
    } catch (error) {
      expect(service).toBeDefined();
      expect(checkDatastoreSpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(Error);
      expect(error['status']).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(error['response']).toBe(errorMsg);
    }
  });
});
