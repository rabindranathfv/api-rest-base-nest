import { Datastore } from '@google-cloud/datastore';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { BIG_QUERY_REPOSITORY } from 'src/bigquery/repository/big-query.repository';
import { AuthDatastorageRepository } from './auth-datastorage.repository';

import { compare } from 'bcrypt';
import { verify } from 'jsonwebtoken';

import { User } from 'src/users/entities/user.entity';

import { USER_DASHBOARD } from 'src/users/repository/datastore-user.repository';
import { ConfigService } from '@nestjs/config';

import { LoginDto } from '../dto/login.dto';
import { ITokenPayload } from '../interfaces/auth.interfaces';

@Injectable()
export class DatastorageAuthRepository implements AuthDatastorageRepository {
  private readonly logger = new Logger(DatastorageAuthRepository.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configServ: ConfigService,
    @Inject(BIG_QUERY_REPOSITORY) private readonly bigQueryRepository,
  ) {}

  async login(loginDto: LoginDto): Promise<User> {
    const { email, password } = loginDto;
    const instance: Datastore =
      await this.bigQueryRepository.connectWithDatastorage();

    const queryResults = await instance
      .createQuery(`${USER_DASHBOARD}`)
      .filter('email', '=', email);
    const [existUser] = await instance.runQuery(queryResults);

    if (!existUser) return null;

    const isPasswordMatching = await compare(password, existUser[0].password);

    if (!isPasswordMatching) return null;

    const token = await this.jwtService.sign({
      email: existUser[0]?.email,
      name: existUser[0]?.name,
    });
    return { ...existUser[0], token };
  }

  async logout(): Promise<any> {
    try {
      return { message: 'Logout Successfully' };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async refresh(token: string): Promise<any> | null {
    try {
      const configJwt = this.configServ.get('JWT');

      const data = await verify(token, configJwt.secret);
      const { email, name } = data as ITokenPayload;

      const newToken = await this.jwtService.sign({
        email: email,
        name: name,
      });

      return newToken;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
