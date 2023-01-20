import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { SongRepository } from './song.repository';

import { BIG_QUERY_REPOSITORY } from './../../bigquery/repository/big-query.repository';

import canciones_id from '../mock/canciones_id.json';

@Injectable()
export class SongAdapterRepository implements SongRepository {
  private readonly logger = new Logger(SongAdapterRepository.name);

  constructor(
    @Inject(BIG_QUERY_REPOSITORY) private readonly bigQueryRepository,
  ) {}

  async findSongById(queryStr: string, id: string): Promise<any> {
    this.logger.log(
      `using ${SongAdapterRepository.name} - repository - method: findSongById with id: ${id}`,
    );

    try {
      const instance = await this.bigQueryRepository.connectWithBigquery();

      const query = `${queryStr} - ${id}`;
      // const queryResults = await this.bigQueryRepository.query(instance, query);
      const queryResults = canciones_id[id];

      return queryResults;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Error at findSongById repository, error: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
