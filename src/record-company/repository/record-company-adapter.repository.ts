import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';

import { BIG_QUERY_REPOSITORY } from './../../bigquery/repository/big-query.repository';
import { RecordCompanyRepository } from './record-company.repository';

import { discograficas } from '../mock/discograficas';
import { discograficaBitMusic } from '../mock/discografica_1099889';

@Injectable()
export class RecordCompanyAdapterRepository implements RecordCompanyRepository {
  private readonly logger = new Logger(RecordCompanyAdapterRepository.name);

  constructor(
    @Inject(BIG_QUERY_REPOSITORY) private readonly bigQueryRepository,
  ) {}

  async findAllRecordCompanies(queryStr: string): Promise<any> {
    this.logger.log(
      `using ${RecordCompanyAdapterRepository.name} - repository - method: findAllDiscographics`,
    );
    try {
      const instance = await this.bigQueryRepository.connectWithBigquery();

      const query = `${queryStr}`;
      // const queryResults = await this.bigQueryRepository.query(instance, query);
      const queryResults = discograficas;

      return queryResults;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Error at findAllDiscographics repository, error: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findRecordCompanyById(queryStr: string, id: string): Promise<any> {
    this.logger.log(
      `using ${RecordCompanyAdapterRepository.name} - repository - method: findDiscographicById with id: ${id}`,
    );

    try {
      const instance = await this.bigQueryRepository.connectWithBigquery();

      const query = `${queryStr} - ${id}`;
      // const queryResults = await this.bigQueryRepository.query(instance, query);
      const queryResults = discograficaBitMusic;

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
