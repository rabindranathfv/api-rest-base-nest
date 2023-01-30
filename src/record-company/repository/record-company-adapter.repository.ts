import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';

import { BIG_QUERY_REPOSITORY } from './../../bigquery/repository/big-query.repository';
import { RecordCompanyRepository } from './record-company.repository';

import discograficas from '../mock/discograficas.json';
import discografica_id from '../mock/discografica_id.json';
import discografica_id_resumen from '../mock/discografica_id_resumen.json';
import discografica_id_kpi_radio from '../mock/discografica_id_kpi_radio.json';
import discografica_id_list_artistas from '../mock/discografica_id_artists.json';

@Injectable()
export class RecordCompanyAdapterRepository implements RecordCompanyRepository {
  private readonly logger = new Logger(RecordCompanyAdapterRepository.name);

  constructor(
    @Inject(BIG_QUERY_REPOSITORY) private readonly bigQueryRepository,
  ) {}

  async findAllRecordCompanies(): Promise<any> {
    this.logger.log(
      `using ${RecordCompanyAdapterRepository.name} - repository - method: findAllRecordCompanies`,
    );
    try {
      const instance = await this.bigQueryRepository.connectWithBigquery();

      // TODO: UPDATE THIS QUERY
      const queryStr = `SELECT emisora_N1, emisora_N2, id_interprete, interprete_colaboradores, nombre_interprete, inserciones, universo, 
        cobertura, cob, contactos, grp_s, ots, ola, fecha_peticion, rango, rango_sort_order, fecha
        FROM dataglobalproduccion.BI_Artistas_Alt.odec_t`;
      const query = `${queryStr}`;
      // const queryResults = await this.bigQueryRepository.query(instance, query);
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

  async findRecordCompanyById(id: string): Promise<any> {
    this.logger.log(
      `using ${RecordCompanyAdapterRepository.name} - repository - method: findRecordCompanyById with id: ${id}`,
    );

    try {
      const instance = await this.bigQueryRepository.connectWithBigquery();

      // TODO: UPDATE THIS QUERY
      const queryStr = `SELECT emisora_N1, emisora_N2, id_interprete, interprete_colaboradores, nombre_interprete, inserciones, universo, 
        cobertura, cob, contactos, grp_s, ots, ola, fecha_peticion, rango, rango_sort_order, fecha
        FROM dataglobalproduccion.BI_Artistas_Alt.odec_t`;
      const query = `${queryStr} - ${id}`;
      // const queryResults = await this.bigQueryRepository.query(instance, query);
      const queryResults = discografica_id[id];

      return queryResults;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Error at findRecordCompanyById repository, error: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getResumeRecordCompanyById(id: string): Promise<any> {
    this.logger.log(
      `using ${RecordCompanyAdapterRepository.name} - repository - method: getResumeRecordCompanyById with id: ${id}`,
    );

    try {
      const instance = await this.bigQueryRepository.connectWithBigquery();

      // TODO: UPDATE THIS QUERY
      const queryStr = `SELECT emisora_N1, emisora_N2, id_interprete, interprete_colaboradores, nombre_interprete, inserciones, universo, 
        cobertura, cob, contactos, grp_s, ots, ola, fecha_peticion, rango, rango_sort_order, fecha
        FROM dataglobalproduccion.BI_Artistas_Alt.odec_t`;
      const query = `${queryStr} - ${id}`;
      // const queryResults = await this.bigQueryRepository.query(instance, query);
      // TODO: Update mock response
      const queryResults = discografica_id_resumen[id];

      return queryResults;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Error at getResumeRecordCompanyById repository, error: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getRecordCompanyByIdKpiRadio(id: string): Promise<any> {
    this.logger.log(
      `using ${RecordCompanyAdapterRepository.name} - repository - method: getRecordCompanyByIdKpiRadio with id: ${id}`,
    );

    try {
      const instance = await this.bigQueryRepository.connectWithBigquery();

      // TODO: UPDATE THIS QUERY
      const queryStr = `SELECT emisora_N1, emisora_N2, id_interprete, interprete_colaboradores, nombre_interprete, inserciones, universo, 
        cobertura, cob, contactos, grp_s, ots, ola, fecha_peticion, rango, rango_sort_order, fecha
        FROM dataglobalproduccion.BI_Artistas_Alt.odec_t`;
      const query = `${queryStr} - ${id}`;
      // const queryResults = await this.bigQueryRepository.query(instance, query);
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

  async getArtistsRecordCompanyById(id: string): Promise<any> {
    this.logger.log(
      `using ${RecordCompanyAdapterRepository.name} - repository - method: getArtistsRecordCompanyById with id: ${id}`,
    );

    try {
      const instance = await this.bigQueryRepository.connectWithBigquery();

      // TODO: UPDATE THIS QUERY
      const queryStr = `SELECT emisora_N1, emisora_N2, id_interprete, interprete_colaboradores, nombre_interprete, inserciones, universo, 
        cobertura, cob, contactos, grp_s, ots, ola, fecha_peticion, rango, rango_sort_order, fecha
        FROM dataglobalproduccion.BI_Artistas_Alt.odec_t`;
      const query = `${queryStr} - ${id}`;
      // const queryResults = await this.bigQueryRepository.query(instance, query);
      // TODO: Update resp mock data
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
