import { Datastore } from '@google-cloud/datastore';
import { Inject, Injectable, Logger } from '@nestjs/common';

import { User } from '../entities/user.entity';

import { CreateUserDto } from '../dtos/create-user.dto';

import { UsersRepository } from './user.repository';
import { UpdateUserDto } from '../dtos/update-user.dto';

import { hash } from 'bcrypt';
import { BIG_QUERY_REPOSITORY } from 'src/bigquery/repository/big-query.repository';
import { UsersDatastoreRepository } from './user-datastore.repository';

const USER_DASHBOARD = 'User_Dashboard';

@Injectable()
export class DatastoreUserRepository implements UsersDatastoreRepository {
  private readonly logger = new Logger(DatastoreUserRepository.name);

  constructor(
    @Inject(BIG_QUERY_REPOSITORY) private readonly bigQueryRepository,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> | null {
    try {
      const { email, password, name } = createUserDto;

      const instance = await this.bigQueryRepository.connectWithDatastorage();

      const queryResults = instance
        .createQuery('User_Dashboard')
        .order('createdAt');
      const [existUser] = await instance.runQuery(queryResults);
      console.log(
        '🚀 ~ file: datastore-user.repository.ts:58 ~ DatastoreUserRepository ~ createUser ~ existUser',
        existUser,
      );

      if (!existUser || existUser.length === 0) return null;

      const hashedPassword = await hash(password, 10);
      const userKey = instance.key('User_Dashboard');
      const entity = {
        key: userKey,
        data: [
          {
            name: 'createdAt',
            value: new Date().toJSON(),
          },
          {
            name: 'username',
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

      return newUser;
    } catch (error) {
      return null;
    }
  }

  async findAll(): Promise<Array<User>> {
    console.log('USANDO EL DATASTORE USER REPOSITORY*******************');
    this.logger.log(
      `using ${DatastoreUserRepository.name} - repository - method: findAll`,
    );
    try {
      const instance = await this.bigQueryRepository.connectWithDatastorage();

      const queryResults = instance
        .createQuery(`${USER_DASHBOARD}`)
        .order('createdAt');
      const [users] = await instance.runQuery(queryResults);

      return users;
    } catch (error) {
      return null;
    }
  }

  async findById(id: string): Promise<User> | null {
    try {
      const instance: Datastore =
        await this.bigQueryRepository.connectWithDatastorage();

      const transaction = instance.transaction();
      const userKey = instance.key([`${USER_DASHBOARD}`, id]);

      console.log(
        '🚀 ~ file: datastore-user.repository.ts:124 ~ DatastoreUserRepository ~ findById ~ userKey',
        userKey,
      );

      await transaction.run();
      const [user] = await transaction.get(userKey);
      console.log(
        '🚀 ~ file: datastore-user.repository.ts:131 ~ DatastoreUserRepository ~ findById ~ data',
        user,
      );

      //   if (!existUser) return null;

      return null;
    } catch (error) {
      return null;
    }
  }

  async deleteById(id: string): Promise<User> | null {
    try {
      const instance: Datastore =
        await this.bigQueryRepository.connectWithDatastorage();

      const userKey = instance.key([`${USER_DASHBOARD}`, id]);
      if (!userKey) return null;
      console.log(
        '🚀 ~ file: datastore-user.repository.ts:144 ~ DatastoreUserRepository ~ deleteById ~ userKey',
        userKey,
      );
      await instance.delete(userKey);
      this.logger.log(`user ${id} deleted successfully.`);

      return null;
    } catch (error) {
      return null;
    }
  }

  async updateById(
    updateUserDto: UpdateUserDto,
    id: string,
  ): Promise<User> | null {
    const instance: Datastore =
      await this.bigQueryRepository.connectWithDatastorage();
    const transaction = instance.transaction();
    const userKey = instance.key([`${USER_DASHBOARD}`, id]);
    try {
      await transaction.run();
      let [user] = await transaction.get(userKey);
      user = {
        user,
        ...updateUserDto,
      };

      await transaction.save({ key: userKey, data: user });
      this.logger.log(`Task ${id} updated successfully.`);

      return null;
    } catch (error) {
      await transaction.rollback();
      return null;
    }
  }
}
