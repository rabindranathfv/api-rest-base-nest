import { Datastore, Entity } from '@google-cloud/datastore';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { BIG_QUERY_REPOSITORY } from 'src/bigquery/repository/big-query.repository';
import { AuthDatastorageRepository } from './auth-datastorage.repository';

import { hash, compare } from 'bcrypt';
import { verify } from 'jsonwebtoken';

import { User } from 'src/users/entities/user.entity';

import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { LoginDto } from '../dto/login.dto';
import { USER_DASHBOARD } from 'src/users/repository/datastore-user.repository';

export interface ITokenPayload {
  name: string;
  email: string;
}

@Injectable()
export class DatastorageAuthRepository implements AuthDatastorageRepository {
  private readonly logger = new Logger(DatastorageAuthRepository.name);

  constructor(
    private readonly jwtService: JwtService,
    @Inject(BIG_QUERY_REPOSITORY) private readonly bigQueryRepository,
  ) {}

  async refresh(token: string): Promise<any> | null {
    try {
      const data = await verify(token, 'secretSeed');
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

  async login(loginDto: LoginDto): Promise<any> {
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

  async register(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { email, password, name } = createUserDto;

      const instance: Datastore =
        await this.bigQueryRepository.connectWithDatastorage();

      const queryResults = instance
        .createQuery(`${USER_DASHBOARD}`)
        .filter('email', '=', email);
      const [existUser] = await instance.runQuery(queryResults);

      if (!existUser || existUser[0]?.email) return null;

      const hashedPassword = await hash(password, 10);
      const userKey = instance.key(`${USER_DASHBOARD}`);
      const entity: Entity = {
        key: userKey,
        data: [
          {
            name: 'createdAt',
            value: new Date().toJSON(),
          },
          {
            name: 'name',
            value: name,
            excludeFromIndexes: true,
          },
          {
            name: 'email',
            value: email,
          },
          {
            name: 'password',
            value: hashedPassword,
          },
        ],
      };
      const [newUser] = await instance.save(entity);
      this.logger.log(
        `user ${email} with userId ${userKey.id} created successfully.`,
        newUser,
      );

      return {
        id: userKey.id,
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPassword,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async logout(): Promise<any> {
    throw new Error('lgout');
  }
}
