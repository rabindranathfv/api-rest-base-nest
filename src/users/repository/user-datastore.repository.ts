import { User } from '../entities/user.entity';
import { CreateUserDto } from './../dtos/create-user.dto';

export const USER_DATASTORE_REPOSITORY = 'UsersDatastoreRepository';

export interface UsersDatastoreRepository {
  createUser(user: CreateUserDto): Promise<Boolean | User>;
  findAll(): Promise<Array<User>>;
  findById(id: string): Promise<boolean | User>;
  deleteById(id: string): Promise<boolean | Partial<User>>;
  updateById(user: CreateUserDto, id: string): Promise<boolean | Partial<User>>;
}
