import { BigQueryAdapterRepository } from '../bigquery/repository/big-query-adapter.repository';
import { Module, CacheModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

import { configuration } from '../config/configuration';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { User } from '../users/entities/user.entity';
import { UserSchema } from '../users/schemas/user.schema';

import { BIG_QUERY_REPOSITORY } from '../bigquery/repository/big-query.repository';
import { AUTH_DATASTORAGE_REPOSITORY } from './repository/auth-datastorage.repository';
import { AuthDatastoragAdapterRepository } from './repository/auth-datastorage-adapter.repository';
import { USER_DATASTORE_REPOSITORY } from '../users/repository/user-datastore.repository';
import { DatastoreUserRepository } from '../users/repository/datastore-user.repository';

import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    ConfigModule.forFeature(configuration),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        /* istanbul ignore next */
        const jwtConfig = configService.get('JWT');
        /* istanbul ignore next */
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
        /* istanbul ignore next */
        const cacheConfig = configService.get('CACHE');
        /* istanbul ignore next */
        return {
          isGlobal: true,
          ttl: Number(cacheConfig.ttl),
          max: Number(cacheConfig.storage),
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: USER_DATASTORE_REPOSITORY,
      useClass: DatastoreUserRepository,
    },
    {
      provide: BIG_QUERY_REPOSITORY,
      useClass: BigQueryAdapterRepository,
    },
    {
      provide: AUTH_DATASTORAGE_REPOSITORY,
      useClass: AuthDatastoragAdapterRepository,
    },
    JwtStrategy,
  ],
})
export class AuthModule {}
