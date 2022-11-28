import { Injectable, Logger, NotFoundException } from '@nestjs/common';

const users = [
  { id: '1', name: 'u1' },
  { id: '2', name: 'u2' },
];

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
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
    return createUserDTO;
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
