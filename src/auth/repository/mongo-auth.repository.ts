import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { LeanDocument } from 'mongoose';

import { User } from 'src/users/entities/user.entity';
import { UserDocument, UserModel } from 'src/users/schemas/user.schema';

import { AuthRepository } from './auth.repository';
import { LoginDto } from '../dto/login.dto';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';

import { hash, compare } from 'bcrypt';

@Injectable()
export class MongoAuthRepository implements AuthRepository {
  constructor(@InjectModel(User.name) private readonly userModel: UserModel) {}

  async login(loginDto: LoginDto): Promise<any> {
    try {
      const { email, password } = loginDto;
      const existUser = await this.userModel.findOne({ email }).lean();
      console.log(
        '🚀 ~ file: mongo-auth.repository.ts ~ line 22 ~ MongoAuthRepository ~ login ~ existUser',
        existUser,
      );

      if (!existUser) return null;

      const isPasswordMatching = await compare(password, existUser.password);
      console.log(
        '🚀 ~ file: mongo-auth.repository.ts ~ line 30 ~ MongoAuthRepository ~ login ~ isPasswordMatching',
        isPasswordMatching,
      );
      if (!isPasswordMatching) return null;

      return { user: this.mapToUser(existUser), token: 'some token' };
    } catch (error) {
      return error.message;
    }
  }

  async register(createUserDto: CreateUserDto): Promise<User> | null {
    try {
      const { email, password } = createUserDto;
      const existUser = await this.userModel.find({ email }).lean();

      if (!existUser) return null;

      const hashedPassword = await hash(password, 10);
      const newUser = await new this.userModel({
        ...createUserDto,
        password: hashedPassword,
      }).save();

      return this.mapToUser(newUser);
    } catch (error) {
      return error.message;
    }
  }

  async logout(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  private mapToUser(rawUser: LeanDocument<UserDocument>): User {
    const user = new User();

    user.id = rawUser._id;
    user.name = rawUser.name;
    user.email = rawUser.email;

    return user;
  }
}
