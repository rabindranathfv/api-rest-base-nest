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
import { LoginAuth } from '../interfaces/login-auth.interface';
import { NewRefreshTokenDto } from '../dto/new-refresh-token.dto';

@Injectable()
export class AuthDatastoragAdapterRepository
  implements AuthDatastorageRepository
{
  private readonly logger = new Logger(AuthDatastoragAdapterRepository.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configServ: ConfigService,
    @Inject(BIG_QUERY_REPOSITORY) private readonly bigQueryRepository,
  ) {}

  async login(loginDto: LoginDto): Promise<Partial<LoginAuth>> {
    this.logger.log(
      `using ${AuthDatastoragAdapterRepository.name} - repository - method: login`,
    );
    try {
      const { email, password } = loginDto;
      const instance: Datastore =
        await this.bigQueryRepository.connectWithDatastorage();

      const queryResults = await instance
        .createQuery(`${USER_DASHBOARD}`)
        .filter('email', '=', email);
      const [existUser] = await instance.runQuery(queryResults);

      if (existUser.length === 0) return null;

      const isPasswordMatching = await compare(password, existUser[0].password);

      if (!isPasswordMatching) return null;

      const mapExistUser = existUser.map((u) => ({
        name: u.name,
        email: u.email,
      }));
      const token = await this.jwtService.sign({
        email: mapExistUser[0].email,
        name: mapExistUser[0].name,
      });
      return { ...mapExistUser[0], token };
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
      `using ${AuthDatastoragAdapterRepository.name} - repository - method: logout`,
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
      `using ${AuthDatastoragAdapterRepository.name} - repository - method: refresh`,
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

  async newRefresh(
    newRefreshTokenDto: NewRefreshTokenDto,
  ): Promise<any> | null {
    this.logger.log(
      `using ${AuthDatastoragAdapterRepository.name} - repository - method: newRefresh`,
    );
    try {
      const { name, email } = newRefreshTokenDto;
      const instance: Datastore =
        await this.bigQueryRepository.connectWithDatastorage();

      const queryResults = await instance
        .createQuery(`${USER_DASHBOARD}`)
        .filter('email', '=', email);
      const [existUser] = await instance.runQuery(queryResults);

      if (existUser.length === 0) return null;

      const newRefreshToken = await this.jwtService.sign({
        email: email,
        name: name,
      });

      return { token: newRefreshToken };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Error at newRefresh repository, error: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
