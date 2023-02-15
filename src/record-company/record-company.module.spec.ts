import { Test, TestingModule } from '@nestjs/testing';
import { CacheModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { RecordCompanyModule } from './record-company.module';
import { RecordCompanyController } from './record-company.controller';
import { RecordCompanyService } from './record-company.service';
import { BigqueryModule } from '../bigquery/bigquery.module';

import { configuration } from '../config/configuration';
import { BIG_QUERY_REPOSITORY } from '../bigquery/repository/big-query.repository';
import { RECORD_COMPANY_REPOSITORY } from './repository/record-company.repository';

const passportModule = PassportModule.register({ defaultStrategy: 'jwt' });

describe('RecordCompanyModule:::', () => {
  let moduleInst: RecordCompanyModule;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        BigqueryModule,
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
      ],
      controllers: [RecordCompanyController],
      providers: [
        RecordCompanyModule,
        RecordCompanyService,
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
          provide: RECORD_COMPANY_REPOSITORY,
          useFactory: () => ({
            findAllRecordCompanies: () => jest.fn(),
            getSummaryRecordCompanyById: () => jest.fn(),
            getRecordCompanyByIdKpiRadio: () => jest.fn(),
            getArtistsRecordCompanyById: () => jest.fn(),
          }),
        },
        {
          provide: 'JwtStrategy',
          useFactory: () => ({
            validate: () => jest.fn(),
          }),
        },
      ],
      exports: [passportModule],
    }).compile();

    moduleInst = module.get(RecordCompanyModule);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(moduleInst).toBeDefined();
  });
});
