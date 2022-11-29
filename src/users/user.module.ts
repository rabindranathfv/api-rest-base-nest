import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import { UserSchema } from './schemas/user.schema';
import { UserEntity } from './entities/user.entity';

import { MongoUserRepository } from './repository/mongo-user.repository';
import { USER_REPOSITORY } from './repository/user.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserEntity.name, schema: UserSchema }]),
  ],
  providers: [
    UsersService,
    {
      provide: USER_REPOSITORY,
      useClass: MongoUserRepository,
    },
  ],
  controllers: [UsersController],
})
export class UserModule {}
