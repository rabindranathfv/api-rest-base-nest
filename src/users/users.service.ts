import { USER_DATASTORE_REPOSITORY } from './repository/user-datastore.repository';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @Inject(USER_DATASTORE_REPOSITORY) private readonly userDatastoreRepository,
  ) {}

  async findAll() {
    this.logger.log('FindAll Users Service with DATASTORE');
    let userList;
    try {
      userList = await this.userDatastoreRepository.findAll();
      return userList;
    } catch (error) {
      this.logger.log(`FindAll Users Service ERROR`, error);
      throw new HttpException(
        `Error finding users`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createUser(createUserDto: CreateUserDto) {
    this.logger.log('createUser Users Service with DATASTORE');
    try {
      const newUser = await this.userDatastoreRepository.createUser(
        createUserDto,
      );
      console.log(
        '🚀 ~ file: users.service.ts:43 ~ UsersService ~ createUser ~ newUser',
        newUser,
      );

      if (!newUser || Object.keys(newUser).length > 0) {
        console.log('YA EXISTE EL USUARIO');
        return newUser;
      }

      return newUser;
    } catch (error) {
      this.logger.log(`createUser Users Service ERROR`, error);
      throw new HttpException(
        `Error creating and user`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findById(id: string) {
    this.logger.log('findById Users Service with DATASTORE');
    try {
      const findUser = await this.userDatastoreRepository.findById(id);

      if (!findUser) throw new NotFoundException(`user not found ${id}`);

      return findUser;
    } catch (error) {
      this.logger.log(`findById User Service ERROR`, error);
      throw new HttpException(
        `Error find user by id`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateById(UpdateUserDto: UpdateUserDto, id: string) {
    this.logger.log('updateById Users Service with DATASTORE');
    const user = await this.userDatastoreRepository.updateById(
      UpdateUserDto,
      id,
    );

    if (!user) throw new NotFoundException(`can not update user ${id}`);

    return user;
  }

  async deleteById(id: string) {
    this.logger.log('deleteById Users Service with DATASTORE');
    const deleteUser = await this.userDatastoreRepository.deleteById(id);

    if (!deleteUser) throw new NotFoundException(`can not delete user ${id}`);

    return deleteUser;
  }
}
