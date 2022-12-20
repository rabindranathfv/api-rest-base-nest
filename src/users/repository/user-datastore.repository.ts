import { User } from '../entities/user.entity';
import { CreateUserDto } from './../dtos/create-user.dto';

export const USER_DATASTORE_REPOSITORY = 'UsersDatastoreRepository';

export interface UsersDatastoreRepository {
  createUser(user: CreateUserDto): Promise<User> | null;
  findAll(): Promise<Array<User>>;
  findById(id: string): Promise<User> | null;
  deleteById(id: string): Promise<Partial<User>> | null;
  updateById(user: CreateUserDto, id: string): Promise<User> | null;
}
