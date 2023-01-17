import { Test, TestingModule } from '@nestjs/testing';
import { CacheModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import { BigQueryAdapterRepository } from '../bigquery/repository/big-query-adapter.repository';
import { BIG_QUERY_REPOSITORY } from '../bigquery/repository/big-query.repository';
import { DatastoreUserRepository } from './repository/datastore-user.repository';
import { USER_DATASTORE_REPOSITORY } from './repository/user-datastore.repository';
import { configuration } from '../config/configuration';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

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
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: BIG_QUERY_REPOSITORY,
          useClass: BigQueryAdapterRepository,
        },
        {
          provide: USER_DATASTORE_REPOSITORY,
          useClass: DatastoreUserRepository,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
      .spyOn(service, 'findAll')
      .mockImplementation(() => Promise.resolve(usersMock));

    const ctrlResp = await controller.findAll();

    expect(ctrlResp).toEqual(usersMock);
    expect(findAllSpy).toHaveBeenCalled();
  });

  it('should call V and return all the users', async () => {
    const userIdMock = '5662792157757440';
    const userFindMock = {
      email: 'rferreira2@hiberus.com',
      password: '$2b$10$LQ/PYjRGdaH/E4bVn2hw3.vaxLVe5ITSbAr.WnvMTvXeEbjL5mlx6',
      name: 'rabindranath ferreira 2+1 GCLOUD UPD',
      createdAt: '2022-12-23T12:10:17.426Z',
      id: '5662792157757440',
    };
    const findByIdSpy = jest
      .spyOn(service, 'findById')
      .mockImplementation(() => Promise.resolve(userFindMock));

    const ctrlResp = await controller.findById(userIdMock);

    expect(ctrlResp).toEqual(userFindMock);
    expect(findByIdSpy).toBeCalledWith(userIdMock);
    expect(findByIdSpy).toHaveBeenCalled();
  });

  it('should call createUser and return a new user', async () => {
    const createUserDtoMock = {
      name: 'rabindranath ferreira 3',
      email: 'rferreira3@hiberus.com',
      password: '123456',
    };
    const createUserSpy = jest
      .spyOn(service, 'createUser')
      .mockImplementation(() =>
        Promise.resolve({ ...createUserDtoMock, id: 'valid-id' }),
      );

    const ctrlResp = await controller.createUser(createUserDtoMock);

    expect(ctrlResp).toEqual({ ...createUserDtoMock, id: 'valid-id' });
    expect(createUserSpy).toHaveBeenCalled();
    expect(createUserSpy).toBeCalledWith(createUserDtoMock);
  });

  it('should call updateById and return an user updated', async () => {
    const userIdMock = '5662792157757440';
    const updateUserDtoMock = {
      email: 'rferreira2UPD@hiberus.com',
      password: '123456789',
      name: 'rabindranath ferreira 2+1 GCLOUD UPD AGAIN',
    };

    const updateByIdSpy = jest
      .spyOn(service, 'updateById')
      .mockImplementation(() => Promise.resolve(updateUserDtoMock));

    const ctrlResp = await controller.updateById(updateUserDtoMock, userIdMock);

    expect(ctrlResp).toEqual(updateUserDtoMock);
    expect(updateByIdSpy).toBeCalledWith(updateUserDtoMock, userIdMock);
    expect(updateByIdSpy).toHaveBeenCalled();
  });

  it('should call deleteById and return the if of user deleted', async () => {
    const userIdMock = '5662792157757440';
    const userFindMock = {
      id: userIdMock,
    };
    const deleteByIdSpy = jest
      .spyOn(service, 'deleteById')
      .mockImplementation(() => Promise.resolve(userFindMock));

    const ctrlResp = await controller.deleteById(userIdMock);

    expect(ctrlResp).toEqual(userFindMock);
    expect(deleteByIdSpy).toBeCalledWith(userIdMock);
    expect(deleteByIdSpy).toHaveBeenCalled();
  });
});
