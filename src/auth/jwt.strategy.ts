import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { InjectModel } from '@nestjs/mongoose';

import { Request } from 'express';

import { ConfigService } from '@nestjs/config';

import { User } from 'src/users/entities/user.entity';
import { UserModel } from 'src/users/schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configServ: ConfigService,
    @InjectModel(User.name) private readonly userModel: UserModel,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configServ.get('JWT').secret,
    });
  }

  async validate(payload: { id: string }) {
    console.log(
      '🚀 ~ file: jwt.strategy.ts:27 ~ JwtStrategy ~ validate ~ payload',
      payload,
    );
    const user = await this.userModel.findById(payload.id);
    return user;
  }

  private static extractJWT(req: Request): string | null {
    if (
      req.cookies &&
      'token' in req.cookies &&
      req.cookies.user_token.length > 0
    ) {
      return req.cookies.token;
    }
    return null;
  }
}
