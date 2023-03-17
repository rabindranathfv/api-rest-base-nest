import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class AppService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async getHello(): Promise<string> {
    await this.cacheManager.set('cached_items', { key: 24 });
    const cachedItem = await this.cacheManager.get('cached_items');
    console.log(
      '🚀 ~ file: app.service.ts:11 ~ AppService ~ getHello ~ cachedItem:',
      cachedItem,
    );
    return 'Hello World!';
  }
}
