import { Test, TestingModule } from '@nestjs/testing';
import { CacheModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UserModule } from './user.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { configuration } from '../config/configuration';
import { USER_DATASTORE_REPOSITORY } from './repository/user-datastore.repository';
import { BIG_QUERY_REPOSITORY } from '../bigquery/repository/big-query.repository';

describe('UserModule:::', () => {
  let moduleInst: UserModule;

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
        UserModule,
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
      ],
    }).compile();

    moduleInst = module.get(UserModule);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(moduleInst).toBeDefined();
  });
});
