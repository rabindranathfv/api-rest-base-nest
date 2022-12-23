import { BigQueryAdapterRepository } from 'src/bigquery/repository/big-query-adapter.repository';
import { BIG_QUERY_REPOSITORY } from 'src/bigquery/repository/big-query.repository';
import { USER_DATASTORE_REPOSITORY } from './repository/user-datastore.repository';
import { Module, CacheModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import { UserSchema } from './schemas/user.schema';
import { User } from './entities/user.entity';

import { DatastoreUserRepository } from './repository/datastore-user.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
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
    ConfigModule,
  ],
  controllers: [UsersController],
})
export class UserModule {}
