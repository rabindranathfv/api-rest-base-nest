import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
  Put,
  UseGuards,
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
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly userService: UsersService) {}

  @Get('')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'A get for all Users successfully fetched',
    type: [User],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized, does not have a valid token o token is Expired',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
  })
  async findAll() {
    this.logger.log(`${UsersController.name} - findAll with DATASTORE`);
    const userList = await this.userService.findAll();
    return userList;
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'A get for UsersById successfully fetched',
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized, does not have a valid token o token is Expired',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
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
    this.logger.log(`${UsersController.name} - findById ${id} with DATASTORE`);
    const user: User = await this.userService.findById(id);
    return user;
  }

  @Post('')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'users updated successfully',
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized, does not have a valid token o token is Expired',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
  })
  async createUser(@Body() createUserDTO: CreateUserDto) {
    this.logger.log(`${UsersController.name} - createUser with DATASTORE`);
    return await this.userService.createUser(createUserDTO);
  }

  @Put(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'users created successfully',
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized, does not have a valid token o token is Expired',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
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
    this.logger.log(
      `${UsersController.name} - updateById with DATASTORE for id ${id}`,
    );
    return await this.userService.updateById(updateUserDTO, id);
  }

  @Delete(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'users deleted successfully',
    type: DeleteUser,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized, does not have a valid token o token is Expired',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'can not delete user <id>',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'Should be an id of user',
    type: String,
  })
  async deleteById(@Param('id') id: string) {
    this.logger.log(
      `${UsersController.name} - deleteById with DATASTORE for id ${id}`,
    );
    return await this.userService.deleteById(id);
  }
}
