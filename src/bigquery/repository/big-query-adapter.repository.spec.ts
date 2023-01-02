import { Test, TestingModule } from '@nestjs/testing';
import { BigQueryAdapterRepository } from './big-query-adapter.repository';

import { BIG_QUERY_REPOSITORY } from './big-query.repository';

describe('BigQueryAdapterRepository:::', () => {
  let bigQueryRepository: BigQueryAdapterRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: BIG_QUERY_REPOSITORY,
          useClass: BigQueryAdapterRepository,
        },
      ],
    }).compile();

    bigQueryRepository = module.get(BIG_QUERY_REPOSITORY);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(bigQueryRepository).toBeDefined();
  });

  it('should be call connectWithBigquery and get instance from bigQuery', async () => {
    const instance = await bigQueryRepository.connectWithBigquery();

    expect(instance).toBeDefined();
    expect(instance.baseUrl).toBe(
      'https://bigquery.googleapis.com/bigquery/v2',
    );
  });

  it('should be call connectWithBigquery and get NULL trying to connect', async () => {
    const connectWithBigquerypy = jest
      .spyOn(bigQueryRepository, 'connectWithBigquery')
      .mockImplementation(() => null);

    let instance;
    try {
      instance = await bigQueryRepository.connectWithBigquery();
    } catch (error) {
      expect(instance).toBeDefined();
      expect(connectWithBigquerypy).toBeCalled();
      expect(error).toBeDefined();
    }
  });

  it('should be call connectWithDatastorage and get instance from Datastore', async () => {
    const instance = await bigQueryRepository.connectWithDatastorage();

    expect(instance).toBeDefined();
    expect(instance.baseUrl_).toBe('datastore.googleapis.com');
  });

  it('should be call connectWithDatastorage and get ERRIR from Datastore', async () => {
    const connectWithDatastorageSpy = jest
      .spyOn(bigQueryRepository, 'connectWithDatastorage')
      .mockImplementation(() => {
        throw new Error('error');
      });

    try {
      await bigQueryRepository.connectWithDatastorage();
    } catch (error) {
      expect(connectWithDatastorageSpy).toBeCalled();
      expect(error).toBeDefined();
      expect(error).toBeInstanceOf(Error);
    }
  });

  it('should be call query and execute it successfully in bigQuery', async () => {
    const jobMock = {
      id: 'some-valid-job-id',
      getQueryResults: () => jest.fn(),
    };
    const queryResultsMock = [
      { artistId: 'artist1k', name: 'artistName1' },
      { artistId: 'artist2m', name: 'artistName2' },
    ];

    const queryStrMock = `SELECT emisora_N1, emisora_N2, id_interprete, interprete_colaboradores, nombre_interprete, inserciones, universo, 
    cobertura, cob, contactos, grp_s, ots, ola, fecha_peticion, rango, rango_sort_order, fecha
    FROM dataglobalproduccion.BI_Artistas_Alt.odec_t`;

    const instance = await bigQueryRepository.connectWithBigquery();
    jest.spyOn(instance, 'createQueryJob').mockImplementation(() => {
      return Promise.resolve(jobMock);
    });

    jest.spyOn(bigQueryRepository, 'query').mockImplementation(() => {
      return Promise.resolve(queryResultsMock);
    });

    const query = await bigQueryRepository.query(instance, queryStrMock);

    expect(instance).toBeDefined();
    expect(query).toEqual(queryResultsMock);
  });

  it('should be call query and execute it in bigQuery but got an Error', async () => {
    const querySpy = jest
      .spyOn(bigQueryRepository, 'query')
      .mockImplementation((_bigQ, _query) => {
        throw new Error('error');
      });

    const queryStrMock = `1234 select * from validTable`;

    let instance;
    try {
      instance = await bigQueryRepository.connectWithBigquery();
      await bigQueryRepository.query(instance, queryStrMock);
    } catch (error) {
      expect(instance).toBeDefined();
      expect(querySpy).toHaveBeenCalledWith(instance, queryStrMock);
      expect(error).toBeInstanceOf(Error);
    }
  });

  it('should be call check functionality and return some radio station data from bigQuery', async () => {
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

    const queryStr = `SELECT emisora_N1, emisora_N2, id_interprete, interprete_colaboradores, nombre_interprete, inserciones, universo,
    cobertura, cob, contactos, grp_s, ots, ola, fecha_peticion, rango, rango_sort_order, fecha
    FROM dataglobalproduccion.BI_Artistas_Alt.odec_t`;

    const checkSpy = jest
      .spyOn(bigQueryRepository, 'query')
      .mockImplementation(() => {
        return Promise.resolve(queryResultMock);
      });

    const results = await bigQueryRepository.check(queryStr);

    expect(checkSpy).toHaveBeenCalled();
    expect(results).toEqual(queryResultMock);
  });

  it('should be call check functionality and get Error from bigQuery', async () => {
    const queryStrInvalid = `fake SELECT emisora_N1, emisora_N2, id_interprete, interprete_colaboradores, nombre_interprete, inserciones, universo,
    cobertura, cob, contactos, grp_s, ots, ola, fecha_peticion, rango, rango_sort_order, fecha
    FROM dataglobalproduccion.BI_Artistas_Alt.odec_t`;

    const checkSpy = jest
      .spyOn(bigQueryRepository, 'query')
      .mockImplementation(() => {
        throw new Error('error');
      });

    try {
      await bigQueryRepository.check(queryStrInvalid);
    } catch (error) {
      expect(checkSpy).toBeCalled();
      expect(checkSpy).toBeCalledWith(queryStrInvalid);
      expect(error).toBeInstanceOf(Error);
    }
  });

  it('should be call checkDs functionality and return some data from Datastore', async () => {
    const datastoreMock = {
      createQuery: () => jest.fn(),
    };
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
      {
        done: false,
        description: 'some description',
        created: '2022-12-19T11:08:39.958Z',
      },
    ];

    const queryStr = `SELECT emisora_N1, emisora_N2, id_interprete, interprete_colaboradores, nombre_interprete, inserciones, universo,
    cobertura, cob, contactos, grp_s, ots, ola, fecha_peticion, rango, rango_sort_order, fecha
    FROM dataglobalproduccion.BI_Artistas_Alt.odec_t`;

    const instance = await bigQueryRepository.connectWithBigquery();
    jest.spyOn(instance, 'createQueryJob').mockImplementation(() => {
      return Promise.resolve(datastoreMock);
    });

    const results = await bigQueryRepository.checkDs(queryStr);

    expect(results.length > 0).toBeTruthy();
    expect(results.length).toBe(queryResultMock.length);
  });

  it('should be call checkDs functionality and get Error from Datastore', async () => {
    const queryStrInvalid = `fake SELECT emisora_N1, emisora_N2, id_interprete, interprete_colaboradores, nombre_interprete, inserciones, universo,
    cobertura, cob, contactos, grp_s, ots, ola, fecha_peticion, rango, rango_sort_order, fecha
    FROM dataglobalproduccion.BI_Artistas_Alt.odec_t`;

    try {
      await bigQueryRepository.checkDs(queryStrInvalid);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});
