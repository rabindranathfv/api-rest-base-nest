import { Datastore } from '@google-cloud/datastore';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { BIG_QUERY_REPOSITORY } from 'src/bigquery/repository/big-query.repository';
import { AuthDatastorageRepository } from './auth-datastorage.repository';

import { hash, compare } from 'bcrypt';

import { User } from 'src/users/entities/user.entity';

import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class DatastorageAuthRepository implements AuthDatastorageRepository {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(BIG_QUERY_REPOSITORY) private readonly bigQueryRepository,
  ) {}

  async login(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;
    const instance: Datastore =
      await this.bigQueryRepository.connectWithDatastorage();

    const queryResults = instance
      .createQuery('User_Dashboard')
      .filter('email', '=', email);
    const [existUser] = await instance.runQuery(queryResults);

    console.log(
      '🚀 ~ file: datastorage-auth.repository.ts:33 ~ DatastorageAuthRepository ~ login ~ password*****',
      password,
      existUser[0].password,
      !existUser || existUser[0]?.email,
    );
    if (!existUser) return null;

    const isPasswordMatching = await compare(password, existUser[0].password);
    console.log(
      '🚀 ~ file: datastorage-auth.repository.ts:43 ~ DatastorageAuthRepository ~ login ~ isPasswordMatching',
      isPasswordMatching,
    );

    if (!isPasswordMatching) return null;

    const token = await this.jwtService.sign({
      email: existUser[0]?.email,
      name: existUser[0]?.name,
      password: existUser[0]?.paswword,
    });
    return { ...existUser[0], token };
  }
  async register(createUserDto: CreateUserDto): Promise<User> {
    console.log(
      '🚀 ~ file: datastorage-auth.repository.ts:50 ~ DatastorageAuthRepository ~ register ~ createUserDto',
      createUserDto,
    );
    throw new Error('Method not implemented.');
  }
  async logout(): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
