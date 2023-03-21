import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { BigqueryModule } from '../bigquery/bigquery.module';

import { RecordCompanyController } from './record-company.controller';
import { RecordCompanyService } from './record-company.service';
import { JwtStrategy } from './../auth/jwt.strategy';

import { RECORD_COMPANY_REPOSITORY } from './repository/record-company.repository';
import { RecordCompanyAdapterRepository } from './repository/record-company-adapter.repository';
import { BIG_QUERY_REPOSITORY } from './../bigquery/repository/big-query.repository';
import { BigQueryAdapterRepository } from '../bigquery/repository/big-query-adapter.repository';
import { configuration } from '../config/configuration';

const passportModule = PassportModule.register({ defaultStrategy: 'jwt' });
@Module({
  imports: [
    BigqueryModule,
    ConfigModule.forFeature(configuration),
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
      provide: BIG_QUERY_REPOSITORY,
      useClass: BigQueryAdapterRepository,
    },
    {
      provide: RECORD_COMPANY_REPOSITORY,
      useClass: RecordCompanyAdapterRepository,
    },
    JwtStrategy,
  ],
  exports: [passportModule],
})
export class RecordCompanyModule {}
