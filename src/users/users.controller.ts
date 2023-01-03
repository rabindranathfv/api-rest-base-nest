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
} from '@nestjs/swagger';

import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import { UsersService } from './users.service';

import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './entities/user.entity';
import { DeleteUser } from './interface/delete-user.interface';

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

  @Get('')
  @ApiResponse({
    status: 200,
    description: 'A get for all Users successfully fetched',
    type: [User],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized, does not have a valid token o token is Expired',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async findAll() {
    this.logger.log('FindAll Users Ctrl with DATASTORE');
    const userList = await this.userService.findAll();
    return userList;
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'A get for UsersById successfully fetched',
    type: User,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized, does not have a valid token o token is Expired',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @ApiResponse({
    status: 404,
    description: 'user not found <id>',
  })
  @ApiResponse({
    status: 403,
    description: 'Unauthorized Request',
  })
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
  @ApiResponse({
    status: 200,
    description: 'users updated successfully',
    type: User,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized, does not have a valid token o token is Expired',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async createUser(@Body() createUserDTO: CreateUserDto) {
    this.logger.log('createUser Users Ctrl');
    // TODO: add response for an existing email
    // throw new HttpException(
    //   `this email ${createUserDto.email} already exist or have some errors`,
    //   HttpStatus.CONFLICT,
    // );
    return await this.userService.createUser(createUserDTO);
  }

  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'users created successfully',
    type: User,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized, does not have a valid token o token is Expired',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @ApiResponse({
    status: 404,
    description: 'can not update user <id>',
  })
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
  @ApiResponse({
    status: 200,
    description: 'users deleted successfully',
    type: DeleteUser,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized, does not have a valid token o token is Expired',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @ApiResponse({
    status: 404,
    description: 'can not delete user <id>',
  })
  @ApiResponse({
    status: 403,
    description: 'Unauthorized Request',
  })
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
