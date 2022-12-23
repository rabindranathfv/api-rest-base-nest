import { BigQueryAdapterRepository } from 'src/bigquery/repository/big-query-adapter.repository';
import { Module, CacheModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

import { configuration } from 'src/config/configuration';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { User } from 'src/users/entities/user.entity';
import { UserSchema } from 'src/users/schemas/user.schema';

import { BIG_QUERY_REPOSITORY } from 'src/bigquery/repository/big-query.repository';
import { AUTH_DATASTORAGE_REPOSITORY } from './repository/auth-datastorage.repository';
import { DatastorageAuthRepository } from './repository/datastorage-auth.repository';
import { USER_DATASTORE_REPOSITORY } from 'src/users/repository/user-datastore.repository';
import { DatastoreUserRepository } from 'src/users/repository/datastore-user.repository';

import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    ConfigModule.forFeature(configuration),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
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
      useClass: DatastoreUserRepository,
    },
    {
      provide: BIG_QUERY_REPOSITORY,
      useClass: BigQueryAdapterRepository,
    },
    {
      provide: AUTH_DATASTORAGE_REPOSITORY,
      useClass: DatastorageAuthRepository,
    },
    JwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
