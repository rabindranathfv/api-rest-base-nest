import { CreateUserDto } from './dtos/create-user.dto';
import { USER_REPOSITORY } from './repository/user.repository';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@Inject(USER_REPOSITORY) private readonly usersRepository) {}

  async findAll() {
    this.logger.log('FindAll Users Service');
    return await this.usersRepository.findAll();
  }

  async findById(id: string) {
    this.logger.log('findById Users Service');
    const findUser = await this.usersRepository.findById(id);

    if (!findUser) throw new NotFoundException(`user not found ${id}`);

    return findUser;
  }

  async createUser(createUserDTO: any) {
    this.logger.log('createUser Users Service');
    const newUser = await this.usersRepository.createUser(createUserDTO);

    if (!newUser)
      throw new HttpException(
        `this ${createUserDTO.email} already exist or have some errors`,
        HttpStatus.CONFLICT,
      );

    return newUser;
  }

  async updateById(createUserDTO: Partial<CreateUserDto>, id: string) {
    this.logger.log('updateById Users Service');
    console.log(
      '🚀 ~ file: users.service.ts ~ line 46 ~ UsersService ~ updateById ~ createUserDTO',
      createUserDTO,
    );
    const user = await this.usersRepository.updateById(createUserDTO, id);

    if (!user) throw new NotFoundException(`can not update user ${id}`);

    return { id, createUserDTO };
  }

  async deleteById(id: string) {
    this.logger.log('deleteById Users Service');
    const deleteUser = await this.usersRepository.deleteById(id);

    if (!deleteUser) throw new NotFoundException(`can not delete user ${id}`);

    return deleteUser;
  }
}
