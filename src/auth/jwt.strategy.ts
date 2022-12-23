import { USER_DASHBOARD } from 'src/users/repository/datastore-user.repository';
import { Inject, Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';

import { ConfigService } from '@nestjs/config';

import { BIG_QUERY_REPOSITORY } from 'src/bigquery/repository/big-query.repository';
import { Datastore } from '@google-cloud/datastore';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configServ: ConfigService,
    @Inject(BIG_QUERY_REPOSITORY) private readonly bigQueryRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configServ.get('JWT').secret,
    });
  }

  async validate(payload: { email: string; name: string }) {
    const { email, name } = payload;

    const instance: Datastore =
      await this.bigQueryRepository.connectWithDatastorage();

    const queryResults = await instance
      .createQuery(`${USER_DASHBOARD}`)
      .filter('email', '=', email);
    const [existUser] = await instance.runQuery(queryResults);

    if (!existUser || Object.keys(existUser[0]).length < 0) return null;

    return { email, name };
  }
}
