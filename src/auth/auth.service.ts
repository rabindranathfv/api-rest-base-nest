import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Cache } from 'cache-manager';

import { USER_REPOSITORY } from 'src/users/repository/user.repository';
import { AUTH_REPOSITORY } from './repository/auth.repository';
import { AUTH_DATASTORAGE_REPOSITORY } from './repository/auth-datastorage.repository';

import { CreateUserDto } from './../users/dtos/create-user.dto';
import { LoginDto } from './dto/login.dto';

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
    const newUser = await this.usersRepository.createUser(createUserDto);

    if (!newUser)
      throw new HttpException(
        `this ${createUserDto.email} already exist or have some errors`,
        HttpStatus.CONFLICT,
      );

    return newUser;
  }

  async logout() {
    return { message: 'Successfully logged' };
  }
}
