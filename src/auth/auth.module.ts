import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

import { configuration } from 'src/config/configuration';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { User } from 'src/users/entities/user.entity';
import { UserSchema } from 'src/users/schemas/user.schema';

import { MongoUserRepository } from 'src/users/repository/mongo-user.repository';
import { USER_REPOSITORY } from 'src/users/repository/user.repository';

import { MongoAuthRepository } from './repository/mongo-auth.repository';
import { AUTH_REPOSITORY } from './repository/auth.repository';
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
          signOptions: { expiresIn: jwtConfig.expiresIn },
        };
      },
    }),
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
    JwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
