import { Test, TestingModule } from '@nestjs/testing';
import { CacheModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { USER_DATASTORE_REPOSITORY } from '../users/repository/user-datastore.repository';
import { BIG_QUERY_REPOSITORY } from '../bigquery/repository/big-query.repository';
import { AUTH_DATASTORAGE_REPOSITORY } from './repository/auth-datastorage.repository';

import { configuration } from '../config/configuration';

describe('AuthModule:::', () => {
  let moduleInst: AuthModule;

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
        AuthModule,
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

    moduleInst = module.get(AuthModule);
  });

  it('should be defined', () => {
    expect(moduleInst).toBeDefined();
  });
});
