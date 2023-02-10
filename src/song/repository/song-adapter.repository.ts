import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { SongRepository } from './song.repository';

import { BIG_QUERY_REPOSITORY } from './../../bigquery/repository/big-query.repository';

import canciones_id_resumen from '../mock/canciones_id_resumen.json';
import canciones_id_kpi_radio from '../mock/canciones_id_kpi_radio.json';
import canciones_id_kpis from '../mock/canciones_id_kpis.json';

@Injectable()
export class SongAdapterRepository implements SongRepository {
  private readonly logger = new Logger(SongAdapterRepository.name);

  constructor(
    @Inject(BIG_QUERY_REPOSITORY) private readonly bigQueryRepository,
  ) {}

  async getSummarySongById(id: string): Promise<any> {
    this.logger.log(
      `using ${SongAdapterRepository.name} - repository - method: getSummarySongById with id: ${id}`,
    );

    try {
      const instance = await this.bigQueryRepository.connectWithBigquery();

      // TODO: UPDATE THIS QUERY
      const queryStr = `SELECT emisora_N1, emisora_N2, id_interprete, interprete_colaboradores, nombre_interprete, inserciones, universo, 
        cobertura, cob, contactos, grp_s, ots, ola, fecha_peticion, rango, rango_sort_order, fecha
        FROM dataglobalproduccion.BI_Artistas_Alt.odec_t`;
      const query = `${queryStr} - ${id}`;
      // const queryResults = await this.bigQueryRepository.query(instance, query);
      const queryResults = canciones_id_resumen[id];
      console.log(
        '🚀 ~ file: song-adapter.repository.ts:66 ~ SongAdapterRepository ~ getSummarySongById ~ queryResults',
        queryResults,
      );

      return queryResults;
    } catch (error) {
      console.log('here~~~~~~', error);
      throw new HttpException(
        `Error at getSummarySongById repository, error: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getKpiRadioSongById(id: string): Promise<any> {
    this.logger.log(
      `using ${SongAdapterRepository.name} - repository - method: getKpiRadioSongById with id: ${id}`,
    );

    try {
      const instance = await this.bigQueryRepository.connectWithBigquery();

      // TODO: UPDATE THIS QUERY
      const queryStr = `SELECT emisora_N1, emisora_N2, id_interprete, interprete_colaboradores, nombre_interprete, inserciones, universo, 
        cobertura, cob, contactos, grp_s, ots, ola, fecha_peticion, rango, rango_sort_order, fecha
        FROM dataglobalproduccion.BI_Artistas_Alt.odec_t`;
      const query = `${queryStr} - ${id}`;
      // const queryResults = await this.bigQueryRepository.query(instance, query);
      const queryResults = canciones_id_kpi_radio[id];

      return queryResults;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Error at getKpiRadioSongById repository, error: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getKpisSongById(id: string): Promise<any> {
    this.logger.log(
      `using ${SongAdapterRepository.name} - repository - method: getKpisSongById with id: ${id}`,
    );

    try {
      const instance = await this.bigQueryRepository.connectWithBigquery();

      // TODO: UPDATE THIS QUERY
      const queryStr = `SELECT emisora_N1, emisora_N2, id_interprete, interprete_colaboradores, nombre_interprete, inserciones, universo, 
        cobertura, cob, contactos, grp_s, ots, ola, fecha_peticion, rango, rango_sort_order, fecha
        FROM dataglobalproduccion.BI_Artistas_Alt.odec_t`;
      const query = `${queryStr} - ${id}`;
      // const queryResults = await this.bigQueryRepository.query(instance, query);

      // TODO: UPDATE THIS MOCK RESPONSE ON JSON FILE
      const queryResults = canciones_id_kpis[id];

      return queryResults;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Error at getKpisSongById repository, error: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
