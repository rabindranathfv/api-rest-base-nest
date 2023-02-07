import { User } from 'src/users/entities/user.entity';
import { LoginAuth } from '../interfaces/login-auth.interface';
import { LoginDto } from './../dto/login.dto';

export const AUTH_DATASTORAGE_REPOSITORY = 'AuthDatastoragetoreRepository';

export interface AuthDatastorageRepository {
  login(loginDto: LoginDto): Promise<Partial<LoginAuth>>;
  refresh(token: string): Promise<any> | null;
  logout(): Promise<any>;
}
