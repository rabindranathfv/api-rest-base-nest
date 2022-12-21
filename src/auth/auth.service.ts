import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  Req,
} from '@nestjs/common';
import { Cache } from 'cache-manager';

import { USER_REPOSITORY } from 'src/users/repository/user.repository';
import { AUTH_REPOSITORY } from './repository/auth.repository';
import { AUTH_DATASTORAGE_REPOSITORY } from './repository/auth-datastorage.repository';

import { verify } from 'jsonwebtoken';

import { CreateUserDto } from './../users/dtos/create-user.dto';
import { LoginDto } from './dto/login.dto';

import { Request } from 'express';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(USER_REPOSITORY) private readonly usersRepository,
    @Inject(AUTH_REPOSITORY) private readonly authRepository,
    @Inject(AUTH_DATASTORAGE_REPOSITORY)
    private readonly authDatastoreRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async login(loginDto: LoginDto) {
    this.logger.log('login Auth Service');
    // TODO: Remenber using different REPOSITORY
    // const loginProcess = await this.authRepository.login(loginDto);
    const loginProcess = await this.authDatastoreRepository.login(loginDto);
    console.log(
      '🚀 ~ file: auth.service.ts:48 ~ AuthService ~ login ~ loginProcess',
      loginProcess,
    );

    if (!loginProcess)
      throw new HttpException(
        `this email ${loginDto.email} was not found or just password is incorrect, please check it`,
        HttpStatus.CONFLICT,
      );

    // await this.cacheManager.set(`login-${loginProcess.id}`, loginProcess);
    // const cacheResp = await this.cacheManager.get(`users-${loginProcess.id}`);
    return loginProcess;
  }

  async register(createUserDto: CreateUserDto) {
    this.logger.log('register Auth Service');
    // const newUser = await this.usersRepository.createUser(createUserDto);
    const newUser = await this.authDatastoreRepository.register(createUserDto);

    if (!newUser)
      throw new HttpException(
        `this ${createUserDto.email} already exist or have some errors`,
        HttpStatus.CONFLICT,
      );

    return newUser;
  }

  async refresh(@Req() req: Request) {
    try {
      const [, token] = req.headers.authorization.split(' ');
      const newToken = await this.authDatastoreRepository.refresh(token);

      if (!newToken) return null;

      return newToken;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async logout() {
    this.logger.log('logout Auth Service');
    const newUser = await this.authDatastoreRepository.logout();
    console.log(
      '🚀 ~ file: auth.service.ts:81 ~ AuthService ~ logout ~ newUser',
      newUser,
    );
    return { message: 'Successfully logged' };
  }
}
