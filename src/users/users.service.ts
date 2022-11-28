import { Injectable, NotFoundException } from '@nestjs/common';

const users = [
  { id: '1', name: 'u1' },
  { id: '2', name: 'u2' },
];

@Injectable()
export class UsersService {
  async findAll() {
    return users;
  }

  async findById(id: string) {
    const user = users.find((user) => user.id === id);

    if (!user) throw new NotFoundException(`user not found ${id}`);

    return user;
  }

  async createUser(createUserDTO: any) {
    return createUserDTO;
  }

  async updateById(createUserDTO: any, id: string) {
    const user = users.find((user) => user.id === id);

    if (!user) throw new NotFoundException(`can not update user ${id}`);

    return { id, createUserDTO };
  }

  async deleteById(id: string) {
    const user = users.find((user) => user.id === id);

    if (!user) throw new NotFoundException(`can not delete user ${id}`);

    return { id };
  }
}
