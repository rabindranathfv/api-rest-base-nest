/* istanbul ignore file */
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Redis } from 'ioredis';
import { DEFAULT_REDIS_NAMESPACE, InjectRedis } from '@liaoliaots/nestjs-redis';

import { BIG_QUERY_REPOSITORY } from './../../bigquery/repository/big-query.repository';
import { RecordCompanyRepository } from './record-company.repository';

import discograficas from '../mock/discograficas.json';
import discografica_id_resumen from '../mock/discografica_id_resumen.json';
import discografica_id_kpi_radio from '../mock/discografica_id_kpi_radio.json';
import discografica_id_list_artistas from '../mock/discografica_id_artists.json';

@Injectable()
export class RecordCompanyAdapterRepository implements RecordCompanyRepository {
  private readonly logger = new Logger(RecordCompanyAdapterRepository.name);

  constructor(
    @InjectRedis(DEFAULT_REDIS_NAMESPACE) private readonly redis: Redis,
  ) {}

  async findAllRecordCompanies(filter = '', searchText = ''): Promise<any> {
    this.logger.log(
      `using ${RecordCompanyAdapterRepository.name} - repository - method: findAllRecordCompanies`,
    );
    try {
      const queryResults = discograficas;

      return queryResults;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Error at findAllRecordCompanies repository, error: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getSummaryRecordCompanyById(id: string): Promise<any> {
    this.logger.log(
      `using ${RecordCompanyAdapterRepository.name} - repository - method: getResumeRecordCompanyById with id: ${id}`,
    );

    try {
      // TODO: Update mock response
      const queryResults = discografica_id_resumen[id];

      return queryResults;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Error at getSummaryRecordCompanyById repository, error: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getRecordCompanyByIdKpiRadio(id: string): Promise<any> {
    this.logger.log(
      `using ${RecordCompanyAdapterRepository.name} - repository - method: getSummaryRecordCompanyById with id: ${id}`,
    );

    try {
      // TODO: Update mock response data
      const queryResults = discografica_id_kpi_radio[id];

      return queryResults;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Error at getRecordCompanyByIdKpiRadio repository, error: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getArtistsRecordCompanyById(
    id: string,
    filter = '',
    searchText = '',
  ): Promise<any> {
    this.logger.log(
      `using ${RecordCompanyAdapterRepository.name} - repository - method: getArtistsRecordCompanyById with id: ${id}`,
    );

    try {
      const query = `${id} - ${filter} - ${searchText}`;
      // TODO: Update resp mock data
      console.log(
        '🚀 ~ file: record-company-adapter.repository.ts:95 ~ RecordCompanyAdapterRepository ~ query:',
        query,
      );
      const queryResults = discografica_id_list_artistas[id];

      return queryResults;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Error at getArtistsRecordCompanyById repository, error: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
