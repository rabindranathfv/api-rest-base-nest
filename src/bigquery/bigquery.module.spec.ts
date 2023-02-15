import { Test, TestingModule } from '@nestjs/testing';
import { CacheModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { BigqueryModule } from './bigquery.module';
import { BigqueryService } from './bigquery.service';
import { BigqueryController } from './bigquery.controller';

import { configuration } from '../config/configuration';
import { BIG_QUERY_REPOSITORY } from '../bigquery/repository/big-query.repository';

describe('BigqueryModule:::', () => {
  let moduleInst: BigqueryModule;

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
      controllers: [BigqueryController],
      providers: [
        BigqueryModule,
        BigqueryService,
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

    moduleInst = module.get(BigqueryModule);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(moduleInst).toBeDefined();
  });
});
