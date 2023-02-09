import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';

import { RECORD_COMPANY_REPOSITORY } from './repository/record-company.repository';

@Injectable()
export class RecordCompanyService {
  private readonly logger = new Logger(RecordCompanyService.name);

  constructor(
    @Inject(RECORD_COMPANY_REPOSITORY) private readonly recordCompanyRepository,
  ) {}

  async findAllRecordCompanies(): Promise<any> {
    this.logger.log(`${RecordCompanyService.name} - findAllDiscographics`);
    try {
      const queryResults =
        await this.recordCompanyRepository.findAllRecordCompanies();

      return queryResults;
    } catch (error) {
      this.logger.log(
        `${RecordCompanyService.name} - findAllRecordCompanies -  ERROR`,
        error,
      );
      throw new HttpException(
        `Error make query in findAllRecordCompanies`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getSummaryRecordCompanyById(id: string): Promise<any> {
    this.logger.log(
      `${RecordCompanyService.name} - getSummaryRecordCompanyById`,
    );
    try {
      const queryResults =
        await this.recordCompanyRepository.getSummaryRecordCompanyById(id);

      return queryResults;
    } catch (error) {
      this.logger.log(
        `${RecordCompanyService.name} - getSummaryRecordCompanyById -  ERROR`,
        error,
      );
      throw new HttpException(
        `Error make query getSummaryRecordCompanyById`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getRecordCompanyByIdKpiRadio(id: string): Promise<any> {
    this.logger.log(
      `${RecordCompanyService.name} - getRecordCompanyByIdKpiRadio`,
    );
    try {
      const queryResults =
        await this.recordCompanyRepository.getRecordCompanyByIdKpiRadio(id);

      return queryResults;
    } catch (error) {
      this.logger.log(
        `${RecordCompanyService.name} - getRecordCompanyByIdKpiRadio -  ERROR`,
        error,
      );
      throw new HttpException(
        `Error make query getRecordCompanyByIdKpiRadio`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getArtistsRecordCompanyById(id: string): Promise<any> {
    this.logger.log(
      `${RecordCompanyService.name} - getArtistsRecordCompanyById`,
    );
    try {
      const queryResults =
        await this.recordCompanyRepository.getArtistsRecordCompanyById(id);

      return queryResults;
    } catch (error) {
      this.logger.log(
        `${RecordCompanyService.name} - getArtistsRecordCompanyById -  ERROR`,
        error,
      );
      throw new HttpException(
        `Error make query getArtistsRecordCompanyById`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
