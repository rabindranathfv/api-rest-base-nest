import { UsersService } from './users.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  async findAll() {
    return await this.userService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return await this.userService.findById(id);
  }

  @Post()
  async createUser(@Body() createUserDTO: CreateUserDto) {
    console.log(
      '🚀 ~ file: users.controller.ts ~ line 29 ~ UsersController ~ createUser',
      createUserDTO,
      typeof createUserDTO,
    );
    return await this.userService.createUser(createUserDTO);
  }

  @Put(':id')
  async updateById(
    @Body() createUserDTO: CreateUserDto,
    @Param('id') id: string,
  ) {
    return await this.userService.updateById(createUserDTO, id);
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    return await this.userService.deleteById(id);
  }
}
