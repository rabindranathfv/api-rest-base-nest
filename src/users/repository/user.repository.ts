import { UserEntity } from '../entities/user.entity';
import { CreateUserDto } from './../dtos/create-user.dto';

export const USER_REPOSITORY = 'UsersRepository';

export interface UsersRepository {
  createUser(user: CreateUserDto): Promise<UserEntity> | null;
  findAll(): Promise<Array<UserEntity>>;
  findById(id: string): Promise<UserEntity> | null;
  deleteById(id: string): Promise<UserEntity> | null;
  updateById(user: CreateUserDto, id: string): Promise<UserEntity> | null;
}
