import { Test, TestingModule } from '@nestjs/testing';
import { CacheModule, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { configuration } from '../config/configuration';

import { AuthService } from './auth.service';

import { USER_DATASTORE_REPOSITORY } from '../users/repository/user-datastore.repository';
import { AUTH_DATASTORAGE_REPOSITORY } from './repository/auth-datastorage.repository';
import { MockType } from 'src/bigquery/bigquery.service.spec';

describe('AuthService:::', () => {
  let service: AuthService;
  let authRepository: MockType<any>;
  let userRepository: MockType<any>;

  const responseMock = (authHeader?: string) => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    if (authHeader) {
      res.headers = { authorization: authHeader };
    }
    return res;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forFeature(configuration),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            const jwtConfig = configService.get('JWT');
            return {
              secret: jwtConfig.secret,
              signOptions: { expiresIn: '2h' || jwtConfig.expiresIn },
            };
          },
        }),
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
      providers: [
        AuthService,
        {
          provide: USER_DATASTORE_REPOSITORY,
          useFactory: () => ({
            createUser: () => jest.fn(),
          }),
        },
        {
          provide: AUTH_DATASTORAGE_REPOSITORY,
          useFactory: () => ({
            login: () => jest.fn(),
            logout: () => jest.fn(),
            refresh: () => jest.fn(),
          }),
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(USER_DATASTORE_REPOSITORY);
    authRepository = module.get(AUTH_DATASTORAGE_REPOSITORY);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(userRepository).toBeDefined();
    expect(authRepository).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should call logout method and returns logout successfully', async () => {
    const logoutRespMock = { message: 'Logout Successfully' };
    const authLogoutRepSpy = jest
      .spyOn(authRepository, 'logout')
      .mockImplementation(() => Promise.resolve(logoutRespMock));

    const respSer = await service.logout();

    expect(authLogoutRepSpy).toBeCalled();
    expect(respSer).toEqual(logoutRespMock);
  });

  it('should call register method and return a new user', async () => {
    const createUserDtoMock = {
      name: 'rabindranath ferreira 3',
      email: 'rferreira3@hiberus.com',
      password: '123456',
    };
    const createUserSpy = jest
      .spyOn(userRepository, 'createUser')
      .mockImplementation(() =>
        Promise.resolve({ ...createUserDtoMock, id: 'valid-id' }),
      );

    const resServ = await service.register(createUserDtoMock);

    expect(resServ).toEqual({ ...createUserDtoMock, id: 'valid-id' });
    expect(createUserSpy).toBeCalled();
    expect(createUserSpy).toBeCalledWith(createUserDtoMock);
  });

  it('should call register method with an existing email and should responde same createUserDto', async () => {
    const createUserDtoMock = {
      name: 'rabindranath ferreira 3',
      email: 'rferreira3@hiberus.com',
      password: '123456',
    };
    const createUserSpy = jest
      .spyOn(userRepository, 'createUser')
      .mockImplementation(() => {
        return Promise.resolve(false);
      });

    try {
      await service.register(createUserDtoMock);
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

  it('should call login method and get response successfully', async () => {
    const loginDtoMock = {
      email: 'rferreira@hiberus.com',
      password: '123456',
    };
    const loginRespMock = {
      email: 'rferreira@hiberus.com',
      createdAt: '2022-12-20T11:15:47.536Z',
      name: 'rabindranath ferreira 1+1 GCLOUD',
      password: '$2b$10$MPkbN/jlBzrDYi/8EmoYKelDIjK.BdXslDY.UOFkm/CeSDfHuVa/C',
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJmZXJyZWlyYUBoaWJlcnVzLmNvbSIsIm5hbWUiOiJyYWJpbmRyYW5hdGggZmVycmVpcmEgMSsxIEdDTE9VRCIsImlhdCI6MTY3Mjc1Njk4MSwiZXhwIjoxNjcyNzY0MTgxfQ.qtKJzEI8o1Ty8wTd2UDHmE5qyzY9gAmt_CsbVPZ3Q4k',
    };
    const loginSpy = jest
      .spyOn(authRepository, 'login')
      .mockImplementation(() => {
        return Promise.resolve(loginRespMock);
      });

    const servRes = await service.login(loginDtoMock);

    expect(loginSpy).toBeCalled();
    expect(loginSpy).toHaveBeenCalledWith(loginDtoMock);
    expect(servRes).toEqual(loginRespMock);
  });

  it('should call login method and get error 409', async () => {
    const loginDtoMock = {
      email: 'rferreira@hiberus.com',
      password: '123456',
    };
    const loginRespMock = null;
    const loginSpy = jest
      .spyOn(authRepository, 'login')
      .mockImplementation(() => {
        return Promise.resolve(loginRespMock);
      });

    try {
      await service.login(loginDtoMock);
    } catch (error) {
      expect(loginSpy).toBeCalled();
      expect(loginSpy).toHaveBeenCalledWith(loginDtoMock);
      expect(error).toBeInstanceOf(Error);
      expect(error['status']).toBe(HttpStatus.CONFLICT);
      expect(error['message']).toBe(
        `this email ${loginDtoMock.email} was not found or just password is incorrect, please check it`,
      );
    }
  });

  // TODO: Important there is no need to apply test without the token bearer because of the strategy based on passport
  it('should call refresh method and get response successfully', async () => {
    const validToken = `some-valid-token`;
    const refreshRespMock = {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJmZXJyZWlyYUBoaWJlcnVzLmNvbSIsIm5hbWUiOiJyYWJpbmRyYW5hdGggZmVycmVpcmEgMSsxIEdDTE9VRCIsImlhdCI6MTY3Mjg2MTg3OCwiZXhwIjoxNjcyODY5MDc4fQ.t5dkD_UJGl7-fzwkSUHQX8WRYuiqf8EcjeTZ2wIh0pA',
    };
    const refreshSpy = jest
      .spyOn(authRepository, 'refresh')
      .mockImplementation(() => {
        return Promise.resolve(refreshRespMock);
      });

    const servRes = await service.refresh(responseMock(validToken));

    expect(refreshSpy).toBeCalled();
    expect(servRes).toEqual(refreshRespMock);
  });
});
