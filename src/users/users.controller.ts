import {
  Body,
  CacheInterceptor,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiHeader,
  ApiParam,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { UsersService } from './users.service';

import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './entities/user.entity';

@ApiBearerAuth()
@ApiTags('user')
@ApiHeader({
  name: 'X-Request-id',
  description: 'Custom header for requestId',
})
@UseGuards(JwtAuthGuard)
@UseInterceptors(CacheInterceptor) // cache for all get methods on this ctrl
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly userService: UsersService) {}

  // @ApiResponse({
  //   status: 200,
  //   description: 'A get for all Users successfully fetched',
  //   type: [User],
  // })
  // @ApiBody({ type: User })

  // @Delete(':id')
  // @ApiParam({
  //   name: 'id',
  //   required: true,
  //   description: 'Should be an id of user',
  //   type: String,
  // })

  // ENDPOINTS WITH DATASTORE
  @Get('')
  async findAll() {
    this.logger.log('FindAll Users Ctrl with DATASTORE');
    const userList = await this.userService.findAll();
    return userList;
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of user',
    type: String,
  })
  async findById(@Param('id') id: string) {
    this.logger.log('findById Users Ctrl');
    const user: User = await this.userService.findById(id);
    return user;
  }

  @Post('')
  async createUser(@Body() createUserDTO: CreateUserDto) {
    this.logger.log('createUser Users Ctrl');
    return await this.userService.createUser(createUserDTO);
  }

  @Put(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of user',
    type: String,
  })
  async updateById(
    @Body() updateUserDTO: UpdateUserDto,
    @Param('id') id: string,
  ) {
    this.logger.log('updateById Users Ctrl');
    return await this.userService.updateById(updateUserDTO, id);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of user',
    type: String,
  })
  async deleteById(@Param('id') id: string) {
    this.logger.log('deleteById Users Ctrl');
    return await this.userService.deleteById(id);
  }
}
