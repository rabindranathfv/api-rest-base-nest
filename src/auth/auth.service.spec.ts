import { Test, TestingModule } from '@nestjs/testing';
import { CacheModule, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { AuthService } from './auth.service';

import { USER_DATASTORE_REPOSITORY } from '../users/repository/user-datastore.repository';
import { AUTH_DATASTORAGE_REPOSITORY } from './repository/auth-datastorage.repository';
import { MockType } from 'src/bigquery/bigquery.service.spec';

import { configuration } from '../config/configuration';

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

  const passportModule = PassportModule.register({ defaultStrategy: 'jwt' });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forFeature(configuration),
        passportModule,
        JwtModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            const jwtConfig = configService.get('JWT');
            return {
              secret: jwtConfig.secret,
              signOptions: { expiresIn: jwtConfig.expiresIn || '1h' },
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
        ThrottlerModule.forRoot({
          ttl: 60,
          limit: 10,
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
            newRefresh: () => jest.fn(),
          }),
        },
        {
          provide: 'JwtStrategy',
          useFactory: () => ({
            validate: () => jest.fn(),
          }),
        },
        {
          provide: APP_GUARD,
          useClass: ThrottlerGuard,
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

  it('should call register method with an existing email and should responde Error 400', async () => {
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
      expect(error['status']).toBe(HttpStatus.BAD_REQUEST);
      expect(error['message']).toBe(
        `this email: ${createUserDtoMock.email} has been used`,
      );
    }
  });

  it('should call register method and return Error 500', async () => {
    const createUserDtoMock = {
      name: 'rabindranath ferreira 3',
      email: 'rferreira3@hiberus.com',
      password: '123456',
    };
    const createUserSpy = jest
      .spyOn(userRepository, 'createUser')
      .mockImplementation(() => {
        throw new Error('error 500');
      });

    try {
      await service.register(createUserDtoMock);
    } catch (error) {
      expect(createUserSpy).toBeCalled();
      expect(createUserSpy).toBeCalledWith(createUserDtoMock);
      expect(error).toBeInstanceOf(Error);
      await expect(service.register(createUserDtoMock)).rejects.toThrowError(
        Error,
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

  it('should call login method and get error 401 UNAUTHORIZED', async () => {
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
      expect(error['status']).toBe(HttpStatus.UNAUTHORIZED);
      expect(error['message']).toBe(
        `this email ${loginDtoMock.email} was not found or just password is incorrect, please check it`,
      );
    }
  });

  it('should call login method and get error 500', async () => {
    const loginDtoMock = {
      email: 'rferreira@hiberus.com',
      password: '123456',
    };
    const loginSpy = jest
      .spyOn(authRepository, 'login')
      .mockImplementation(() => {
        throw new Error('error 500');
      });

    try {
      await service.login(loginDtoMock);
    } catch (error) {
      expect(loginSpy).toBeCalled();
      expect(loginSpy).toHaveBeenCalledWith(loginDtoMock);
      expect(error).toBeInstanceOf(Error);
      await expect(service.login(loginDtoMock)).rejects.toThrowError(Error);
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

  it('should call refresh method and get response error 500', async () => {
    const validToken = `some-valid-token`;
    const refreshSpy = jest
      .spyOn(authRepository, 'refresh')
      .mockImplementation(() => {
        return Promise.reject(new Error('error 500'));
      });

    try {
      await service.refresh(responseMock(validToken));
    } catch (error) {
      expect(refreshSpy).toBeCalled();
      expect(error).toBeInstanceOf(Error);
      await expect(
        service.refresh(responseMock(validToken)),
      ).rejects.toThrowError(Error);
    }
  });

  it('should call newRefresh method and get response successfully', async () => {
    const newRefreshTokenDtoMOck = {
      email: 'rferreira3@hiberus.com',
      name: 'rabindranath ferreira 3',
    };
    const refreshRespMock = {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJmZXJyZWlyYUBoaWJlcnVzLmNvbSIsIm5hbWUiOiJyYWJpbmRyYW5hdGggZmVycmVpcmEgMSsxIEdDTE9VRCIsImlhdCI6MTY3Mjg2MTg3OCwiZXhwIjoxNjcyODY5MDc4fQ.t5dkD_UJGl7-fzwkSUHQX8WRYuiqf8EcjeTZ2wIh0pA',
    };
    const newRefreshSpy = jest
      .spyOn(authRepository, 'newRefresh')
      .mockImplementation(() => {
        return Promise.resolve(refreshRespMock);
      });

    const servRes = await service.newRefresh(newRefreshTokenDtoMOck);

    expect(newRefreshSpy).toBeCalled();
    expect(servRes).toEqual(refreshRespMock);
  });

  it('should call newRefresh method and get response error 401 UNAUTHORIZED', async () => {
    const newRefreshTokenDtoMOck = {
      email: 'rferreira3@hiberus.com',
      name: 'rabindranath ferreira 3',
    };
    const loginRespMock = null;
    const newRefreshSpy = jest
      .spyOn(authRepository, 'newRefresh')
      .mockImplementation(() => {
        return Promise.resolve(loginRespMock);
      });

    try {
      await service.newRefresh(newRefreshTokenDtoMOck);
    } catch (error) {
      expect(newRefreshSpy).toBeCalled();
      expect(error).toBeInstanceOf(Error);
      expect(error['status']).toBe(HttpStatus.UNAUTHORIZED);
      expect(error['message']).toBe(
        `this email ${newRefreshTokenDtoMOck.email} was not found or just password is incorrect, please check your credentials`,
      );
      await expect(
        service.newRefresh(newRefreshTokenDtoMOck),
      ).rejects.toThrowError(Error);
    }
  });

  it('should call newRefresh method and get response error 500', async () => {
    const newRefreshTokenDtoMOck = {
      email: 'rferreira3@hiberus.com',
      name: 'rabindranath ferreira 3',
    };
    const newRefreshSpy = jest
      .spyOn(authRepository, 'newRefresh')
      .mockImplementation(() => {
        return Promise.reject(new Error('error 500'));
      });

    try {
      await service.newRefresh(newRefreshTokenDtoMOck);
    } catch (error) {
      expect(newRefreshSpy).toBeCalled();
      expect(error).toBeInstanceOf(Error);
      await expect(
        service.newRefresh(newRefreshTokenDtoMOck),
      ).rejects.toThrowError(Error);
    }
  });
});
