import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  Req,
} from '@nestjs/common';

import { AUTH_DATASTORAGE_REPOSITORY } from './repository/auth-datastorage.repository';

import { CreateUserDto } from './../users/dtos/create-user.dto';
import { LoginDto } from './dto/login.dto';

import { Request } from 'express';
import { USER_DATASTORE_REPOSITORY } from '../users/repository/user-datastore.repository';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(USER_DATASTORE_REPOSITORY) private readonly userDatastoreRepository,
    @Inject(AUTH_DATASTORAGE_REPOSITORY)
    private readonly authDatastoreRepository,
  ) {}

  async login(loginDto: LoginDto) {
    this.logger.log('login Auth Service');
    const loginProcess = await this.authDatastoreRepository.login(loginDto);

    if (!loginProcess)
      throw new HttpException(
        `this email ${loginDto.email} was not found or just password is incorrect, please check it`,
        HttpStatus.CONFLICT,
      );
    return loginProcess;
  }

  async register(createUserDto: CreateUserDto) {
    this.logger.log('register Auth Service');
    const newUser = await this.userDatastoreRepository.createUser(
      createUserDto,
    );

    if (!newUser)
      throw new HttpException(
        `this ${createUserDto.email} already exist or have some errors`,
        HttpStatus.CONFLICT,
      );

    return newUser;
  }

  async refresh(@Req() req: Request) {
    this.logger.log('refresh Auth Service');
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
    try {
      const logoutUser = await this.authDatastoreRepository.logout();
      if (!logoutUser) return null;

      return logoutUser;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
