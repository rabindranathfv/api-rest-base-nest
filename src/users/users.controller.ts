import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

// @ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly userService: UsersService) {}

  @Get()
  async findAll() {
    this.logger.log('FindAll Users Ctrl');
    return await this.userService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    this.logger.log('findById Users Ctrl');
    return await this.userService.findById(id);
  }

  @Post()
  async createUser(@Body() createUserDTO: CreateUserDto) {
    this.logger.log('createUser Users Ctrl');
    return await this.userService.createUser(createUserDTO);
  }

  @Put(':id')
  async updateById(
    @Body() updateUserDTO: UpdateUserDto,
    @Param('id') id: string,
  ) {
    this.logger.log('updateById Users Ctrl');
    return await this.userService.updateById(updateUserDTO, id);
  }

  @Delete(':id')
  async deleteById(@Param('id') id: string) {
    this.logger.log('deleteById Users Ctrl');
    return await this.userService.deleteById(id);
  }
}
