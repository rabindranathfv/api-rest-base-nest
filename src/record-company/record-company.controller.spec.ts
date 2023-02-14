import { Test, TestingModule } from '@nestjs/testing';
import { CacheModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { BigqueryModule } from './../bigquery/bigquery.module';

import { RecordCompanyService } from './record-company.service';
import { RecordCompanyController } from './record-company.controller';

import { configuration } from './../config/configuration';
import { RECORD_COMPANY_REPOSITORY } from './repository/record-company.repository';

import discograficas from './mock/discograficas.json';
import discografica_id_resumen from './mock/discografica_id_resumen.json';
import discografica_id_kpi_radio from './mock/discografica_id_kpi_radio.json';
import discografica_id_list_artistas from './mock/discografica_id_artists.json';

describe('RecordCompanyController', () => {
  let controller: RecordCompanyController;
  let service: RecordCompanyService;

  const passportModule = PassportModule.register({ defaultStrategy: 'jwt' });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        BigqueryModule,
        ConfigModule.forFeature(configuration),
        CacheModule.registerAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            /* istanbul ignore next */
            const cacheConfig = configService.get('CACHE');
            /* istanbul ignore next */
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
        RecordCompanyService,
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
    }).compile();

    controller = module.get<RecordCompanyController>(RecordCompanyController);
    service = module.get<RecordCompanyService>(RecordCompanyService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
