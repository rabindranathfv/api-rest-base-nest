import { User } from '../entities/user.entity';
import { CreateUserDto } from './../dtos/create-user.dto';

export const USER_REPOSITORY = 'UsersRepository';

export interface UsersRepository {
  createUser(user: CreateUserDto): Promise<User>;
}
