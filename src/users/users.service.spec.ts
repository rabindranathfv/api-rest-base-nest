import { Test, TestingModule } from '@nestjs/testing';
import { CacheModule, HttpException, NotFoundException } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UsersService } from './users.service';

import { USER_DATASTORE_REPOSITORY } from './repository/user-datastore.repository';
import { configuration } from '../config/configuration';
import { MockType } from 'src/bigquery/bigquery.service.spec';

describe('UsersService:::', () => {
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

  it('should call findAll and return an empty users list', async () => {
    const usersMock = [];
    const findAllSpy = jest
      .spyOn(repository, 'findAll')
      .mockImplementation(() => Promise.resolve(usersMock));

    const serviceResp = await service.findAll();

    expect(serviceResp).toEqual(usersMock);
    expect(findAllSpy).toHaveBeenCalled();
  });

  it('should call createdUser and return a new user', async () => {
    const createUserDtoMock = {
      name: 'rabindranath ferreira 3',
      email: 'rferreira3@hiberus.com',
      password: '123456',
    };
    const createUserSpy = jest
      .spyOn(repository, 'createUser')
      .mockImplementation(() =>
        Promise.resolve({ ...createUserDtoMock, id: 'valid-id' }),
      );

    const resServ = await service.createUser(createUserDtoMock);

    expect(resServ).toEqual({ ...createUserDtoMock, id: 'valid-id' });
    expect(createUserSpy).toBeCalled();
    expect(createUserSpy).toBeCalledWith(createUserDtoMock);
  });

  it('should call createdUser with an existing email and should responde same createUserDto', async () => {
    const createUserDtoMock = {
      name: 'rabindranath ferreira 3',
      email: 'rferreira3@hiberus.com',
      password: '123456',
    };
    const createUserSpy = jest
      .spyOn(repository, 'createUser')
      .mockImplementation(() => {
        return Promise.resolve(false);
      });

    try {
      await service.createUser(createUserDtoMock);
    } catch (error) {
      expect(createUserSpy).toBeCalled();
      expect(createUserSpy).toBeCalledWith(createUserDtoMock);
      expect(error).toBeInstanceOf(HttpException);
      expect(error['status']).toBe(409);
      expect(error['message']).toBe(
        `this email: ${createUserDtoMock.email} has been used`,
      );
    }
  });

  it('should call findById and return an specific users', async () => {
    const userIdMock = '5662792157757440';
    const userFindMock = {
      email: 'rferreira2@hiberus.com',
      password: '$2b$10$LQ/PYjRGdaH/E4bVn2hw3.vaxLVe5ITSbAr.WnvMTvXeEbjL5mlx6',
      name: 'rabindranath ferreira 2+1 GCLOUD UPD',
      createdAt: '2022-12-23T12:10:17.426Z',
      id: '5662792157757440',
    };
    const findByIdSpy = jest
      .spyOn(repository, 'findById')
      .mockImplementation(() => Promise.resolve(userFindMock));

    const serviceResp = await service.findById(userIdMock);

    expect(serviceResp).toEqual(userFindMock);
    expect(findByIdSpy).toBeCalledWith(userIdMock);
    expect(findByIdSpy).toHaveBeenCalled();
  });

  it('should call findById and return and error because the id does not exist or is invalid', async () => {
    const userIdMock = 'user-id-1';
    const findByIdSpy = jest
      .spyOn(repository, 'findById')
      .mockImplementation(() => Promise.resolve([]));

    try {
      await service.findById(userIdMock);
    } catch (error) {
      expect(findByIdSpy).toHaveBeenCalled();
      expect(findByIdSpy).toBeCalledWith(userIdMock);
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error['status']).toBe(404);
      expect(error['message']).toBe(
        `can not update because user not found ${userIdMock}`,
      );
    }
  });

  it('should call deleteById and return the if of user deleted', async () => {
    const userIdMock = '5662792157757440';
    const userFindMock = {
      id: userIdMock,
    };
    const deleteByIdSpy = jest
      .spyOn(repository, 'deleteById')
      .mockImplementation(() => Promise.resolve(userFindMock));

    const serviceResp = await service.deleteById(userIdMock);

    expect(serviceResp).toEqual({ id: userFindMock.id });
    expect(deleteByIdSpy).toBeCalledWith(userIdMock);
    expect(deleteByIdSpy).toHaveBeenCalled();
  });

  it('should call deleteById and return 404 exception because the id is invalid or not found', async () => {
    const userIdMock = '56627921.s';
    const deleteByIdSpy = jest
      .spyOn(repository, 'deleteById')
      .mockImplementation(() => Promise.resolve(false));

    try {
      await service.deleteById(userIdMock);
    } catch (error) {
      expect(deleteByIdSpy).toHaveBeenCalled();
      expect(deleteByIdSpy).toBeCalledWith(userIdMock);
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error['status']).toBe(404);
    }
  });

  it('should call deleteById and return throw error exception because the id is invalid or not found', async () => {
    const userIdMock = '56627921.s';
    const findByIdSpy = jest
      .spyOn(repository, 'deleteById')
      .mockImplementation(() => {
        throw new Error('error');
      });

    try {
      await service.deleteById(userIdMock);
    } catch (error) {
      expect(findByIdSpy).toHaveBeenCalled();
      expect(findByIdSpy).toBeCalledWith(userIdMock);
      expect(error).toBeInstanceOf(Error);
    }
  });

  it('should call updateById and return an user updated', async () => {
    const userIdMock = '5662792157757440';
    const updateUserDtoMock = {
      email: 'rferreira2UPD@hiberus.com',
      password: '123456789',
      name: 'rabindranath ferreira 2+1 GCLOUD UPD AGAIN',
    };

    const updateByIdSpy = jest
      .spyOn(repository, 'updateById')
      .mockImplementation(() => Promise.resolve(updateUserDtoMock));

    const serviceResp = await service.updateById(updateUserDtoMock, userIdMock);

    expect(serviceResp).toEqual(updateUserDtoMock);
    expect(updateByIdSpy).toBeCalledWith(updateUserDtoMock, userIdMock);
    expect(updateByIdSpy).toHaveBeenCalled();
  });

  it('should call updateById and return 404 exception because the id is invalid or not found', async () => {
    const userIdMock = 'invalid-id';
    const updateUserDtoMock = {
      email: 'rferreira2UPD@hiberus.com',
      password: '123456789',
      name: 'rabindranath ferreira 2+1 GCLOUD UPD AGAIN',
    };
    const updateByIdSpy = jest
      .spyOn(repository, 'updateById')
      .mockImplementation(() => Promise.resolve(false));

    try {
      await service.updateById(updateUserDtoMock, userIdMock);
    } catch (error) {
      expect(updateByIdSpy).toHaveBeenCalled();
      expect(updateByIdSpy).toBeCalledWith(updateUserDtoMock, userIdMock);
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error['status']).toBe(404);
      expect(error['message']).toBe(`can not update user ${userIdMock}`);
    }
  });
});
