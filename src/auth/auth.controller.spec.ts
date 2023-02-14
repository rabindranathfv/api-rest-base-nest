import { Test, TestingModule } from '@nestjs/testing';
import { CacheModule, HttpStatus } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Response, Request } from 'express';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { BIG_QUERY_REPOSITORY } from './../bigquery/repository/big-query.repository';
import { USER_DATASTORE_REPOSITORY } from '../users/repository/user-datastore.repository';
import { BigQueryAdapterRepository } from '../bigquery/repository/big-query-adapter.repository';
import { AUTH_DATASTORAGE_REPOSITORY } from './repository/auth-datastorage.repository';

import { configuration } from '../config/configuration';
import { APP_GUARD } from '@nestjs/core';

describe('AuthController:::', () => {
  let controller: AuthController;
  let service: AuthService;

  const requestMock = () => {
    const req: any = {};
    req.query = jest.fn().mockReturnValue(req);
    req.params = jest.fn().mockReturnValue(req);
    req.body = jest.fn().mockReturnValue(req);
    return req;
  };

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
        CacheModule.registerAsync({
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
        ThrottlerModule.forRoot({
          ttl: 60,
          limit: 10,
        }),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
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
        {
          provide: BIG_QUERY_REPOSITORY,
          useFactory: () => ({
            connectWithBigquery: () => jest.fn(),
            query: () => jest.fn(),
            check: () => jest.fn(),
            connectWithDatastorage: () => jest.fn(),
            checkDs: () => jest.fn(),
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

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
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
    const loginSpy = jest.spyOn(service, 'login').mockImplementation(() => {
      return Promise.resolve(loginRespMock);
    });

    const ctrlResp = await controller.login(loginDtoMock);

    expect(ctrlResp).toBeDefined();
    expect(loginSpy).toHaveBeenCalled();
    expect(loginSpy).toHaveBeenCalledWith(loginDtoMock);
  });

  it('should call register method and return a new user', async () => {
    const createUserDtoMock = {
      name: 'rabindranath ferreira 3',
      email: 'rferreira3@hiberus.com',
      password: '123456',
    };
    const createUserSpy = jest
      .spyOn(service, 'register')
      .mockImplementation(() =>
        Promise.resolve({ ...createUserDtoMock, id: 'valid-id' }),
      );

    const ctrlResp = await controller.register(createUserDtoMock);

    expect(ctrlResp).toEqual({ ...createUserDtoMock, id: 'valid-id' });
    expect(createUserSpy).toBeCalled();
    expect(createUserSpy).toBeCalledWith(createUserDtoMock);
  });

  it('should call refresh method and get response successfully', async () => {
    const validToken = `some-valid-token`;
    const refreshRespMock = {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJmZXJyZWlyYUBoaWJlcnVzLmNvbSIsIm5hbWUiOiJyYWJpbmRyYW5hdGggZmVycmVpcmEgMSsxIEdDTE9VRCIsImlhdCI6MTY3Mjg2MTg3OCwiZXhwIjoxNjcyODY5MDc4fQ.t5dkD_UJGl7-fzwkSUHQX8WRYuiqf8EcjeTZ2wIh0pA',
    };
    const refreshSpy = jest.spyOn(service, 'refresh').mockImplementation(() => {
      return Promise.resolve(refreshRespMock);
    });

    const req = requestMock() as never as Request;
    const res = responseMock(validToken) as never as Response;
    const ctrlResp = await controller.refresh(req, res);

    expect(refreshSpy).toBeCalled();
    expect(ctrlResp).toBeDefined();
    expect(res.status).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
  });

  it('should call refresh method and get error 401 because there is some trouble with the bearer token', async () => {
    const invalidToken = ``;
    const refreshSpy = jest.spyOn(service, 'refresh').mockImplementation(() => {
      return Promise.resolve(null);
    });

    const req = requestMock() as never as Request;
    const res = responseMock(invalidToken) as never as Response;
    const ctrlResp = await controller.refresh(req, res);

    expect(refreshSpy).toBeCalled();
    expect(ctrlResp).toBeDefined();
    expect(res.status).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
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
      .spyOn(service, 'newRefresh')
      .mockImplementation(() => {
        return Promise.resolve(refreshRespMock);
      });

    const ctrlResp = await controller.newRefresh(newRefreshTokenDtoMOck);

    expect(newRefreshSpy).toBeCalled();
    expect(ctrlResp).toBeDefined();
    expect(ctrlResp).toEqual(refreshRespMock);
  });

  it('should call newRefresh method and error 500', async () => {
    const newRefreshTokenDtoMOck = {
      email: 'rferreira3@hiberus.com',
      name: 'rabindranath ferreira 3',
    };
    const newRefreshSpy = jest
      .spyOn(service, 'newRefresh')
      .mockImplementation(() => {
        return Promise.reject(new Error('error 500'));
      });

    try {
      await controller.newRefresh(newRefreshTokenDtoMOck);
    } catch (error) {
      expect(newRefreshSpy).toBeCalled();
      expect(error).toBeInstanceOf(Error);
      await expect(
        controller.newRefresh(newRefreshTokenDtoMOck),
      ).rejects.toThrowError();
    }
  });

  it('should call logout method and returns logout successfully', async () => {
    const logoutRespMock = { message: 'Logout Successfully' };
    const authLogoutRepSpy = jest
      .spyOn(service, 'logout')
      .mockImplementation(() => Promise.resolve(logoutRespMock));

    const ctrlResp = await controller.logout();

    expect(authLogoutRepSpy).toBeCalled();
    expect(ctrlResp).toEqual(logoutRespMock);
  });
});
