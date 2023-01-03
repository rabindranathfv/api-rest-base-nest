import { USER_DATASTORE_REPOSITORY } from './repository/user-datastore.repository';
import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  HttpException,
  HttpStatus,
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
    return await this.userDatastoreRepository.findAll();
  }

  async createUser(createUserDto: CreateUserDto) {
    this.logger.log('createUser Users Service with DATASTORE');
    const newUser = await this.userDatastoreRepository.createUser(
      createUserDto,
    );

    if (!newUser || Object.keys(newUser).length <= 0) {
      throw new HttpException(
        `this email: ${createUserDto.email} has been used`,
        HttpStatus.CONFLICT,
      );
    }

    return newUser;
  }

  async findById(id: string) {
    this.logger.log('findById Users Service with DATASTORE');
    const findUser = await this.userDatastoreRepository.findById(id);

    if (!findUser || Object.keys(findUser).length <= 0) {
      throw new NotFoundException(
        `can not update because user not found ${id}`,
      );
    }

    return findUser;
  }

  async updateById(UpdateUserDto: UpdateUserDto, id: string) {
    this.logger.log('updateById Users Service with DATASTORE');
    const user = await this.userDatastoreRepository.updateById(
      UpdateUserDto,
      id,
    );

    if (!user || Object.keys(user).length <= 0)
      throw new NotFoundException(`can not update user ${id}`);

    return user;
  }

  async deleteById(id: string) {
    this.logger.log('deleteById Users Service with DATASTORE');
    const deleteUser = await this.userDatastoreRepository.deleteById(id);

    if (!deleteUser || Object.keys(deleteUser).length <= 0)
      throw new NotFoundException(`can not delete user ${id}`);

    return deleteUser;
  }
}
