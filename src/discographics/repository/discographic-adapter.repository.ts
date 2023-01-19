import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';

import { DiscographicRepository } from './discographic.repository';

import { BIG_QUERY_REPOSITORY } from './../../bigquery/repository/big-query.repository';
import { discographics } from '../mock/discographics';
import { discographicBitMusic } from '../mock/discographic_1099889';

@Injectable()
export class DiscographicAdapterRepository implements DiscographicRepository {
  private readonly logger = new Logger(DiscographicAdapterRepository.name);

  constructor(
    @Inject(BIG_QUERY_REPOSITORY) private readonly bigQueryRepository,
  ) {}

  async findAllDiscographics(queryStr: string): Promise<any> {
    this.logger.log(
      `using ${DiscographicAdapterRepository.name} - repository - method: findAllDiscographics`,
    );
    try {
      const instance = await this.bigQueryRepository.connectWithBigquery();

      const query = `${queryStr}`;
      // const queryResults = await this.bigQueryRepository.query(instance, query);
      const queryResults = discographics;

      return queryResults;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Error at findAllDiscographics repository, error: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findDiscographicById(queryStr: string, id: string): Promise<any> {
    this.logger.log(
      `using ${DiscographicAdapterRepository.name} - repository - method: findDiscographicById`,
    );

    try {
      const instance = await this.bigQueryRepository.connectWithBigquery();

      const query = `${queryStr} - ${id}`;
      // const queryResults = await this.bigQueryRepository.query(instance, query);
      const queryResults = discographicBitMusic;

      return queryResults;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Error at findDiscographicById repository, error: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
