import { UserDocument } from './../schemas/user.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LeanDocument } from 'mongoose';

import { User } from '../entities/user.entity';

import { UserModel } from '../schemas/user.schema';

import { CreateUserDto } from '../dtos/create-user.dto';

import { UsersRepository } from './user.repository';

@Injectable()
export class MongoUserRepository implements UsersRepository {
  constructor(@InjectModel(User.name) private readonly userModel: UserModel) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = await new this.userModel(createUserDto).save();
    return this.mapToUser(newUser);
  }

  private mapToUser(rawUser: LeanDocument<UserDocument>): User {
    const user = new User();

    user.id = rawUser.id;
    user.name = rawUser.name;
    user.email = rawUser.email;
    user.createdAt = rawUser.createdAt;
    user.updatedAt = rawUser.updatedAt;

    return user;
  }
}
