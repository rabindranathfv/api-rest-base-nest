import { User } from 'src/users/entities/user.entity';
import { LoginDto } from './../dto/login.dto';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';

export const AUTH_REPOSITORY = 'AuthRepository';

export interface AuthRepository {
  login(loginDto: LoginDto): Promise<any>;
  register(createUserDto: CreateUserDto): Promise<User> | null;
  logout(): Promise<any>;
}
