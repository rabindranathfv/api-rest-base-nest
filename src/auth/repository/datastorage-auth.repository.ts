/* istanbul ignore file */
import { Datastore } from '@google-cloud/datastore';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { BIG_QUERY_REPOSITORY } from '../../bigquery/repository/big-query.repository';
import { AuthDatastorageRepository } from './auth-datastorage.repository';

import { compare } from 'bcrypt';
import { verify } from 'jsonwebtoken';

import { User } from 'src/users/entities/user.entity';

import { USER_DASHBOARD } from '../../users/repository/datastore-user.repository';
import { ConfigService } from '@nestjs/config';

import { LoginDto } from '../dto/login.dto';
import { ITokenPayload } from '../interfaces/token-payload-auth.interfaces';

@Injectable()
export class DatastorageAuthRepository implements AuthDatastorageRepository {
  private readonly logger = new Logger(DatastorageAuthRepository.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configServ: ConfigService,
    @Inject(BIG_QUERY_REPOSITORY) private readonly bigQueryRepository,
  ) {}

  async login(loginDto: LoginDto): Promise<User> {
    this.logger.log(
      `using ${DatastorageAuthRepository.name} - repository - method: login`,
    );
    try {
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
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Error at login repository, error: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async logout(): Promise<any> {
    this.logger.log(
      `using ${DatastorageAuthRepository.name} - repository - method: logout`,
    );
    try {
      return { message: 'Logout Successfully' };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Error at logout repository, error: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async refresh(token: string): Promise<any> | null {
    this.logger.log(
      `using ${DatastorageAuthRepository.name} - repository - method: refresh`,
    );
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
      throw new HttpException(
        `Error at refresh repository, error: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
