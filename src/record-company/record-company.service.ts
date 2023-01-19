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
      // TODO: UPDATE THIS QUERY
      const query = `SELECT emisora_N1, emisora_N2, id_interprete, interprete_colaboradores, nombre_interprete, inserciones, universo, 
        cobertura, cob, contactos, grp_s, ots, ola, fecha_peticion, rango, rango_sort_order, fecha
        FROM dataglobalproduccion.BI_Artistas_Alt.odec_t`;
      const queryResults =
        await this.recordCompanyRepository.findAllRecordCompanies(query);

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

  async findRecordCompanyById(id: string): Promise<any> {
    this.logger.log(`${RecordCompanyService.name} - findDiscographicById`);
    try {
      // TODO: UPDATE THIS QUERY
      const query = `SELECT emisora_N1, emisora_N2, id_interprete, interprete_colaboradores, nombre_interprete, inserciones, universo, 
        cobertura, cob, contactos, grp_s, ots, ola, fecha_peticion, rango, rango_sort_order, fecha
        FROM dataglobalproduccion.BI_Artistas_Alt.odec_t`;
      const queryResults =
        await this.recordCompanyRepository.findRecordCompanyById(query, id);

      return queryResults;
    } catch (error) {
      this.logger.log(
        `${RecordCompanyService.name} - findRecordCompanyById -  ERROR`,
        error,
      );
      throw new HttpException(
        `Error make query findRecordCompanyById`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
