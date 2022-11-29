import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { User } from 'src/users/entities/user.entity';
import { UserSchema } from 'src/users/schemas/user.schema';

import { MongoUserRepository } from 'src/users/repository/mongo-user.repository';
import { USER_REPOSITORY } from 'src/users/repository/user.repository';

import { MongoAuthRepository } from './repository/mongo-auth.repository';
import { AUTH_REPOSITORY } from './repository/auth.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    AuthService,
    {
      provide: USER_REPOSITORY,
      useClass: MongoUserRepository,
    },
    {
      provide: AUTH_REPOSITORY,
      useClass: MongoAuthRepository,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
