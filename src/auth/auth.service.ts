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
import { NewRefreshTokenDto } from './dto/new-refresh-token.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(USER_DATASTORE_REPOSITORY) private readonly userDatastoreRepository,
    @Inject(AUTH_DATASTORAGE_REPOSITORY)
    private readonly authDatastoreRepository,
  ) {}

  async login(loginDto: LoginDto) {
    this.logger.log(`${AuthService.name} - login`);
    const loginProcess = await this.authDatastoreRepository.login(loginDto);

    if (!loginProcess)
      throw new HttpException(
        `this email ${loginDto.email} was not found or just password is incorrect, please check your credentials`,
        HttpStatus.UNAUTHORIZED,
      );
    return loginProcess;
  }

  async register(createUserDto: CreateUserDto) {
    this.logger.log(`${AuthService.name} - register`);
    const newUser = await this.userDatastoreRepository.createUser(
      createUserDto,
    );

    if (!newUser)
      throw new HttpException(
        `this email: ${createUserDto.email} has been used`,
        HttpStatus.CONFLICT,
      );

    return newUser;
  }

  async refresh(@Req() req: Request) {
    this.logger.log(`${AuthService.name} - refresh`);
    const [, token] = req.headers.authorization.split(' ');

    return await this.authDatastoreRepository.refresh(token);
  }

  async newRefresh(newRefreshTokenDto: NewRefreshTokenDto) {
    this.logger.log(`${AuthService.name} - newRefresh`);
    const newRefreshToken = await this.authDatastoreRepository.newRefresh(
      newRefreshTokenDto,
    );

    if (!newRefreshToken) {
      throw new HttpException(
        `this email ${newRefreshTokenDto.email} was not found or just password is incorrect, please check your credentials`,
        HttpStatus.UNAUTHORIZED,
      );
    }
    return newRefreshToken;
  }

  async logout() {
    this.logger.log(`${AuthService.name} - logout`);
    return await this.authDatastoreRepository.logout();
  }
}
