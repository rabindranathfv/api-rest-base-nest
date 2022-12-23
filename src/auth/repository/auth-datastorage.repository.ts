import { User } from 'src/users/entities/user.entity';
import { LoginDto } from './../dto/login.dto';

export const AUTH_DATASTORAGE_REPOSITORY = 'AuthDatastoreRepository';

export interface AuthDatastorageRepository {
  login(loginDto: LoginDto): Promise<User>;
  refresh(token: string): Promise<any> | null;
  logout(): Promise<any>;
}
