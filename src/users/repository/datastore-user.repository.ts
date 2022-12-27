import { Datastore, Entity } from '@google-cloud/datastore';
import { Inject, Injectable, Logger } from '@nestjs/common';

import { User } from '../entities/user.entity';

import { CreateUserDto } from '../dtos/create-user.dto';

import { UpdateUserDto } from '../dtos/update-user.dto';

import { hash } from 'bcrypt';
import { BIG_QUERY_REPOSITORY } from 'src/bigquery/repository/big-query.repository';
import { UsersDatastoreRepository } from './user-datastore.repository';

export const USER_DASHBOARD = 'User_Dashboard';

@Injectable()
export class DatastoreUserRepository implements UsersDatastoreRepository {
  private readonly logger = new Logger(DatastoreUserRepository.name);

  constructor(
    @Inject(BIG_QUERY_REPOSITORY) private readonly bigQueryRepository,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> | null {
    this.logger.log(
      `using ${DatastoreUserRepository.name} - repository - method: createUser`,
    );
    try {
      const { email, password, name } = createUserDto;

      const instance: Datastore =
        await this.bigQueryRepository.connectWithDatastorage();

      const queryResults = instance
        .createQuery('User_Dashboard')
        .filter('email', '=', email);
      const [existUser] = await instance.runQuery(queryResults);

      if (!existUser || existUser[0]?.email) return null;

      const hashedPassword = await hash(password, 10);
      const userKey = instance.key('User_Dashboard');
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

  async findAll(): Promise<Array<User>> {
    this.logger.log(
      `using ${DatastoreUserRepository.name} - repository - method: findAll`,
    );
    try {
      const instance: Datastore =
        await this.bigQueryRepository.connectWithDatastorage();

      const queryResults = instance
        .createQuery(`${USER_DASHBOARD}`)
        .order('createdAt');
      const [users] = await instance.runQuery(queryResults);
      const usersMapped = users.map((u) => {
        const uKey = u[instance.KEY];
        return {
          id: uKey.id,
          name: u.name,
          email: u.email,
          createdAt: u.createdAt,
        };
      });

      return usersMapped;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async findById(id: string): Promise<User> | null {
    this.logger.log(
      `using ${DatastoreUserRepository.name} - repository - method: findById`,
    );
    try {
      const instance: Datastore =
        await this.bigQueryRepository.connectWithDatastorage();

      const transaction = await instance.transaction();
      const userKey = await instance.key([
        `${USER_DASHBOARD}`,
        Datastore.int(id),
      ]);

      await transaction.run();
      const [user] = await transaction.get(userKey);

      if (!user) return null;

      const userMapped = { ...user, id: id || user[instance.KEY].id };

      return userMapped;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async deleteById(id: string): Promise<Partial<User>> | null {
    this.logger.log(
      `using ${DatastoreUserRepository.name} - repository - method: deleteById`,
    );
    try {
      const instance: Datastore =
        await this.bigQueryRepository.connectWithDatastorage();

      const userKey = await instance.key([
        `${USER_DASHBOARD}`,
        Datastore.int(id),
      ]);
      console.log(
        '🚀 ~ file: datastore-user.repository.ts:138 ~ DatastoreUserRepository ~ deleteById ~ userKey',
        userKey,
      );

      if (!userKey) return null;

      await instance.delete(userKey);

      return { id };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async updateById(
    updateUserDto: UpdateUserDto,
    id: string,
  ): Promise<User> | null {
    this.logger.log(
      `using ${DatastoreUserRepository.name} - repository - method: updateById`,
    );
    const instance: Datastore =
      await this.bigQueryRepository.connectWithDatastorage();
    const transaction = await instance.transaction();

    const userKey = await instance.key([
      `${USER_DASHBOARD}`,
      Datastore.int(id),
    ]);

    if (!userKey) return null;

    try {
      // TODO: this query get some erros with non specific behavior on datastore
      const queryResults = await instance
        .createQuery(`${USER_DASHBOARD}`)
        .filter('__key__', '=', userKey); // update operator = from >, based on https://cloud.google.com/datastore/docs/samples/datastore-key-filter

      const [existUser] = await instance.runQuery(queryResults);

      if (!existUser) return null;

      await transaction.run();
      let [user] = await transaction.get(userKey);
      user = {
        ...(updateUserDto.email && { email: updateUserDto.email }),
        ...(updateUserDto.name && { name: updateUserDto.name }),
        ...(updateUserDto.password && {
          password:
            updateUserDto.password && (await hash(updateUserDto?.password, 10)),
        }),
        createdAt: user.createdAt,
      };

      await transaction.update({ key: userKey, data: user });
      // await transaction.save({ key: userKey, data: user });

      await transaction.commit();
      this.logger.log(`this UserId ${id} was updated successfully.`);

      return user;
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      return null;
    }
  }
}
