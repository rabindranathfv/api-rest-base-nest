import { Injectable } from '@nestjs/common';
import { InjectRedis, DEFAULT_REDIS_NAMESPACE } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

import artists from './artist/mocks/artistas.json';

@Injectable()
export class AppService {
  constructor(
    @InjectRedis(DEFAULT_REDIS_NAMESPACE) private readonly redis: Redis,
  ) {}

  async getHello(): Promise<string> {
    await await this.redis.set('artist', JSON.stringify(artists));
    const cachedItem = await this.redis.get('artist');
    console.log(
      '🚀 ~ file: app.service.ts:11 ~ AppService ~ getHello ~ cachedItem:',
      JSON.parse(cachedItem),
    );
    return 'Hello World!';
  }
}
