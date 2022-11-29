import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';

import { USER_REPOSITORY } from 'src/users/repository/user.repository';
import { AUTH_REPOSITORY } from './repository/auth.repository';

import { CreateUserDto } from './../users/dtos/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(USER_REPOSITORY) private readonly usersRepository,
    @Inject(AUTH_REPOSITORY) private readonly authRepository,
  ) {}

  async login(loginDto: LoginDto) {
    this.logger.log('login Auth Service');
    const loginProcess = await this.authRepository.login(loginDto);

    if (!loginProcess)
      throw new HttpException(
        `this email ${loginDto.email} was not found or just password is incorrect, please check it`,
        HttpStatus.CONFLICT,
      );

    return loginProcess;
  }

  async register(createUserDto: CreateUserDto) {
    this.logger.log('register Auth Service');
    const newUser = await this.usersRepository.createUser(createUserDto);

    if (!newUser)
      throw new HttpException(
        `this ${createUserDto.email} already exist or have some errors`,
        HttpStatus.CONFLICT,
      );

    return newUser;
  }

  async logout() {
    return undefined;
  }
}
