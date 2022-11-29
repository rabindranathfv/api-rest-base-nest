import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LeanDocument } from 'mongoose';

import { UserDocument, UserModel } from './../schemas/user.schema';
import { User } from '../entities/user.entity';

import { CreateUserDto } from '../dtos/create-user.dto';

import { UsersRepository } from './user.repository';

@Injectable()
export class MongoUserRepository implements UsersRepository {
  constructor(@InjectModel(User.name) private readonly userModel: UserModel) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> | null {
    try {
      const { email } = createUserDto;
      const existUser = await this.userModel.findOne({ email }).lean();

      if (!existUser) return null;

      const newUser = await new this.userModel(createUserDto).save();

      return this.mapToUser(newUser);
    } catch (error) {
      return null;
    }
  }

  async findAll(): Promise<Array<User>> {
    const users = await this.userModel.find().lean();
    return users.map((user) => this.mapToUser(user));
  }

  async findById(id: string): Promise<User> | null {
    try {
      const user = await this.userModel.findById({ _id: id }).lean();

      if (!user) return null;

      return this.mapToUser(user);
    } catch (error) {
      return null;
    }
  }

  async deleteById(id: string): Promise<User> | null {
    try {
      const user = await this.userModel.findByIdAndDelete({ _id: id }).lean();

      if (!user) return null;

      return this.mapToUser(user);
    } catch (error) {
      return null;
    }
  }

  async updateById(
    createUserDto: Partial<CreateUserDto>,
    id: string,
  ): Promise<User> | null {
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate({ _id: id }, createUserDto)
        .lean();
      return this.mapToUser(updatedUser);
    } catch (error) {
      return null;
    }
  }

  private mapToUser(rawUser: LeanDocument<UserDocument>): User {
    const user = new User();

    user.id = rawUser._id;
    user.name = rawUser.name;
    user.email = rawUser.email;
    user.createdAt = rawUser.createdAt;
    user.updatedAt = rawUser.updatedAt;

    return user;
  }
}
