import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
  constructor(
    @InjectModel(User.name) private readonly userModel: UserModel,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<any> {
    try {
      const { email, password } = loginDto;
      const existUser = await this.userModel.findOne({ email }).lean();

      if (!existUser) return null;

      const isPasswordMatching = await compare(password, existUser.password);

      if (!isPasswordMatching) return null;

      const token = await this.jwtService.sign({
        id: existUser._id,
        email: existUser.email,
        name: existUser.name,
      });

      return { user: this.mapToUser(existUser), token };
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
