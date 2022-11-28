import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';

const users = [
  { id: '1', name: 'u1' },
  { id: '2', name: 'u2' },
];
@Controller('users')
export class UsersController {
  @Get()
  async findAll() {
    return users;
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return users.find((user) => user.id === id);
  }

  @Post()
  async createUser(@Body() createUserDTO: any) {
    return createUserDTO;
  }

  @Put(':id')
  async updateById(@Body() createUserDTO: any, @Param('id') id: string) {
    return { id, createUserDTO };
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    return { id };
  }
}
