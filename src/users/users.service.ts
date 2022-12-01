import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';

import { USER_REPOSITORY } from './repository/user.repository';

import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @Inject(USER_REPOSITORY) private readonly usersRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async findAll() {
    this.logger.log('FindAll Users Service');
    return await this.usersRepository.findAll();
  }

  async findById(id: string) {
    this.logger.log('findById Users Service');
    const findUser = await this.usersRepository.findById(id);

    if (!findUser) throw new NotFoundException(`user not found ${id}`);

    await this.cacheManager.set(`users-${findUser.id}`, findUser);
    const cacheResp = await this.cacheManager.get(`users-${findUser.id}`);

    console.log(
      '🚀 ~ file: users.service.ts:40 ~ UsersService ~ findById ~ cacheResp',
      cacheResp,
    );
    return findUser;
  }

  async createUser(createUserDto: CreateUserDto) {
    this.logger.log('createUser Users Service');
    const newUser = await this.usersRepository.createUser(createUserDto);

    if (!newUser)
      throw new HttpException(
        `this ${createUserDto.email} already exist or have some errors`,
        HttpStatus.CONFLICT,
      );

    return newUser;
  }

  async updateById(UpdateUserDto: UpdateUserDto, id: string) {
    this.logger.log('updateById Users Service');
    const user = await this.usersRepository.updateById(UpdateUserDto, id);

    if (!user) throw new NotFoundException(`can not update user ${id}`);

    return user;
  }

  async deleteById(id: string) {
    this.logger.log('deleteById Users Service');
    const deleteUser = await this.usersRepository.deleteById(id);

    if (!deleteUser) throw new NotFoundException(`can not delete user ${id}`);

    return deleteUser;
  }
}
