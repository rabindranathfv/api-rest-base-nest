import { BigQueryAdapterRepository } from '../bigquery/repository/big-query-adapter.repository';
import { BIG_QUERY_REPOSITORY } from '../bigquery/repository/big-query.repository';
import { USER_DATASTORE_REPOSITORY } from './repository/user-datastore.repository';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import { DatastoreUserRepository } from './repository/datastore-user.repository';
import { configuration } from '../config/configuration';

@Module({
  imports: [ConfigModule.forFeature(configuration)],
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
