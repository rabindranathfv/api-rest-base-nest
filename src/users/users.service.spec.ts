import { Test, TestingModule } from '@nestjs/testing';
import { CacheModule, HttpStatus } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UsersService } from './users.service';

import { USER_DATASTORE_REPOSITORY } from './repository/user-datastore.repository';
import { configuration } from '../config/configuration';
import { MockType } from 'src/bigquery/bigquery.service.spec';

describe('UsersService', () => {
  let service: UsersService;
  let repository: MockType<any>;

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
      providers: [
        UsersService,
        {
          provide: USER_DATASTORE_REPOSITORY,
          useFactory: () => ({
            createUser: () => jest.fn(),
            findAll: () => jest.fn(),
            findById: () => jest.fn(),
            deleteById: () => jest.fn(),
            updateById: () => jest.fn(),
          }),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(USER_DATASTORE_REPOSITORY);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should call findAll and return all the users', async () => {
    const usersMock = [
      {
        id: '5149887163269120',
        name: 'rabindranath ferreira 1+1 GCLOUD',
        email: 'rferreira@hiberus.com',
        createdAt: '2022-12-20T11:15:47.536Z',
      },
      {
        id: '5662792157757440',
        name: 'rabindranath ferreira 2+1 GCLOUD UPD',
        email: 'rferreira2@hiberus.com',
        createdAt: '2022-12-23T12:10:17.426Z',
      },
    ];
    const findAllSpy = jest
      .spyOn(repository, 'findAll')
      .mockImplementation(() => Promise.resolve(usersMock));

    const serviceResp = await service.findAll();

    expect(serviceResp).toEqual(usersMock);
    expect(findAllSpy).toHaveBeenCalled();
  });

  it('should call findAll and return and empty users list', async () => {
    const usersMock = [];
    const findAllSpy = jest
      .spyOn(repository, 'findAll')
      .mockImplementation(() => Promise.resolve(usersMock));

    const serviceResp = await service.findAll();

    expect(serviceResp).toEqual(usersMock);
    expect(findAllSpy).toHaveBeenCalled();
  });

  it('should call findAll and return Error', async () => {
    const findAllSpy = jest
      .spyOn(repository, 'findAll')
      .mockImplementation(() => {
        throw new Error('error');
      });

    try {
      await service.findAll();
    } catch (error) {
      expect(findAllSpy).toHaveBeenCalled();
      expect(error).toBeInstanceOf(Error);
      expect(error['status']).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(error['response']).toBe(`Error make query`);
    }
  });
});
