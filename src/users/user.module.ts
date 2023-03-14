import { BigQueryAdapterRepository } from '../bigquery/repository/big-query-adapter.repository';
import { BIG_QUERY_REPOSITORY } from '../bigquery/repository/big-query.repository';
import { USER_DATASTORE_REPOSITORY } from './repository/user-datastore.repository';
import { Module, CacheModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import { DatastoreUserRepository } from './repository/datastore-user.repository';
import { configuration } from '../config/configuration';

@Module({
  imports: [
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
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: BIG_QUERY_REPOSITORY,
      useClass: BigQueryAdapterRepository,
    },
    {
      provide: USER_DATASTORE_REPOSITORY,
      useClass: DatastoreUserRepository,
    },
  ],
})
export class UserModule {}
