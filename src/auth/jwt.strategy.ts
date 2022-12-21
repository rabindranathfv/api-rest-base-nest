import { USER_DASHBOARD } from 'src/users/repository/datastore-user.repository';
import { Inject, Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { InjectModel } from '@nestjs/mongoose';

import { verify } from 'jsonwebtoken';

import { ConfigService } from '@nestjs/config';

import { User } from 'src/users/entities/user.entity';
import { UserModel } from 'src/users/schemas/user.schema';
import { BIG_QUERY_REPOSITORY } from 'src/bigquery/repository/big-query.repository';
import { Datastore } from '@google-cloud/datastore';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configServ: ConfigService,
    @InjectModel(User.name) private readonly userModel: UserModel,
    @Inject(BIG_QUERY_REPOSITORY) private readonly bigQueryRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configServ.get('JWT').secret,
    });
  }

  async validate(payload: { email: string; name: string }) {
    const { email } = payload;

    const instance: Datastore =
      await this.bigQueryRepository.connectWithDatastorage();

    const queryResults = await instance
      .createQuery(`${USER_DASHBOARD}`)
      .filter('email', '=', email);
    const [existUser] = await instance.runQuery(queryResults);

    console.log(
      '🚀 ~ file: jwt.strategy.ts:42 ~ JwtStrategy ~ validate ~ user *****',
      existUser[0],
    );
    if (!existUser || existUser[0]?.email) return null;
    // const user = await this.userModel.findById(payload.id);

    console.log('feo****');
    return existUser[0];
  }
}
