import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule, HttpStatus } from '@nestjs/common';

import { BigqueryController } from './bigquery.controller';
import { BigqueryService } from './bigquery.service';
import { configuration } from './../config/configuration';

import { Response } from 'express';

describe('BigqueryController', () => {
  let controller: BigqueryController;
  let service: BigqueryService;

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
              isGlobal: true,
              ttl: Number(cacheConfig.ttl),
              max: Number(cacheConfig.storage),
            };
          },
        }),
      ],
      controllers: [BigqueryController],
      providers: [
        {
          provide: BigqueryService,
          useFactory: () => ({
            check: () => jest.fn(),
            checkDatastore: () => jest.fn(),
          }),
        },
      ],
    }).compile();

    controller = module.get<BigqueryController>(BigqueryController);
    service = module.get<BigqueryService>(BigqueryService);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should be controler and service defined with specific methods and properties', async () => {
    expect(Object.keys(controller)).toEqual(['bigQueryService', 'logger']);
    expect(Object.keys(service)).toEqual(['check', 'checkDatastore']);
  });

  it('should be call checkBigQuery controller and Response 200', async () => {
    const checkResultsMock = [
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
    const checkBigQServSpy = jest
      .spyOn(service, 'check')
      .mockImplementation(() => Promise.resolve(checkResultsMock));

    const res = responseMock() as unknown as Response;
    await controller.checkBigQuery(res);

    expect(checkBigQServSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
  });

  it('should be call checkBigQuery controller and Response 404', async () => {
    const checkBigQServSpy = jest
      .spyOn(service, 'check')
      .mockImplementation(() => Promise.resolve(null));

    const res = responseMock() as unknown as Response;
    await controller.checkBigQuery(res);

    expect(checkBigQServSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
  });

  it('should be call checkDatastore controller and Response 200', async () => {
    const checkResultsMock = [
      {
        created: '2022-12-19T10:57:11.008Z',
        done: false,
        description: 'some description',
      },
      {
        done: false,
        created: '2022-12-19T11:08:12.390Z',
        description: 'some description',
      },
      {
        done: false,
        description: 'some description',
        created: '2022-12-19T11:08:39.958Z',
      },
    ];
    const checkDatastoreServSpy = jest
      .spyOn(service, 'checkDatastore')
      .mockImplementation(() => Promise.resolve(checkResultsMock));

    const res = responseMock() as unknown as Response;
    await controller.checkDatastore(res);

    expect(checkDatastoreServSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
  });

  it('should be call checkDatastore controller and Response 404', async () => {
    const checkDatastoreServSpy = jest
      .spyOn(service, 'checkDatastore')
      .mockImplementation(() => Promise.resolve(null));

    const res = responseMock() as unknown as Response;
    await controller.checkDatastore(res);

    expect(checkDatastoreServSpy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
  });
});
