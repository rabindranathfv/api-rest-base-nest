import { USER_REPOSITORY } from './repository/user.repository';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';

const users = [
  { id: '1', name: 'u1' },
  { id: '2', name: 'u2' },
];

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@Inject(USER_REPOSITORY) private readonly usersRepository) {}

  async findAll() {
    this.logger.log('FindAll Users Service');
    return users;
  }

  async findById(id: string) {
    this.logger.log('findById Users Service');
    const user = users.find((user) => user.id === id);

    if (!user) throw new NotFoundException(`user not found ${id}`);

    return user;
  }

  async createUser(createUserDTO: any) {
    this.logger.log('createUser Users Service');
    return await this.usersRepository.createUser(createUserDTO);
  }

  async updateById(createUserDTO: any, id: string) {
    this.logger.log('updateById Users Service');
    const user = users.find((user) => user.id === id);

    if (!user) throw new NotFoundException(`can not update user ${id}`);

    return { id, createUserDTO };
  }

  async deleteById(id: string) {
    this.logger.log('deleteById Users Service');
    const user = users.find((user) => user.id === id);

    if (!user) throw new NotFoundException(`can not delete user ${id}`);

    return { id };
  }
}
