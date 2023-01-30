/* istanbul ignore file */
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';

import { ArtistRepository } from './artist.repository';
import { BIG_QUERY_REPOSITORY } from '../../bigquery/repository/big-query.repository';

// TODO: Check this mock for graphics
import { radioStationStadistic } from './../mocks/radioStationKPI';

import { artistsMockData } from '../mocks/artistsMock';
import artistas_id_resumen from '../mocks/artistas_id_resumen.json';
import artistas_id_canciones from '../mocks/artistas_id_canciones.json';
import artistas_id_kpi_radio from '../mocks/artistas_id_kpi_radio.json';

import artist_id from '../mocks/artists_id.json';

@Injectable()
export class ArtistAdapterRepository implements ArtistRepository {
  private readonly logger = new Logger(ArtistAdapterRepository.name);

  constructor(
    @Inject(BIG_QUERY_REPOSITORY) private readonly bigQueryRepository,
  ) {}

  async getAllArtists(): Promise<any[]> {
    this.logger.log(
      `using ${ArtistAdapterRepository.name} - repository - method: getAllArtists`,
    );
    try {
      const instance = await this.bigQueryRepository.connectWithBigquery();

      // TODO: UPDATE THIS QUERY
      const queryStr = `SELECT emisora_N1, emisora_N2, id_interprete, interprete_colaboradores, nombre_interprete, inserciones, universo, 
        cobertura, cob, contactos, grp_s, ots, ola, fecha_peticion, rango, rango_sort_order, fecha
        FROM dataglobalproduccion.BI_Artistas_Alt.odec_t`;
      const query = `${queryStr}`;
      // const queryResults = await this.bigQueryRepository.query(instance, query);
      const queryResults = artistsMockData;

      return queryResults;
    } catch (error) {
      return null;
    }
  }

  async getKpiRadioArtistById(artistId: string): Promise<any> {
    this.logger.log(
      `using ${ArtistAdapterRepository.name} - repository - method: getKpiRadioArtistById with id: ${artistId}`,
    );
    try {
      const instance = await this.bigQueryRepository.connectWithBigquery();

      // TODO: UPDATE THIS QUERY
      const queryStr = `SELECT emisora_N1, emisora_N2, id_interprete, interprete_colaboradores, nombre_interprete, inserciones, universo, 
        cobertura, cob, contactos, grp_s, ots, ola, fecha_peticion, rango, rango_sort_order, fecha
        FROM dataglobalproduccion.BI_Artistas_Alt.odec_t`;
      const query = `${queryStr}-${artistId}`;
      // const queryResults = await this.bigQueryRepository.query(instance, query);

      // TODO: Check fistMock for charts on radioStationStadistics
      // const queryResults = radioStationStadistic;
      const queryResults = artistas_id_kpi_radio[artistId];

      return queryResults;
    } catch (error) {
      return null;
    }
  }

  async getSummaryArtistById(artistId: string): Promise<any> {
    this.logger.log(
      `using ${ArtistAdapterRepository.name} - repository - method: getSummaryArtistById with id: ${artistId}`,
    );
    try {
      const instance = await this.bigQueryRepository.connectWithBigquery();

      // TODO: UPDATE THIS QUERY
      const queryStr = `SELECT emisora_N1, emisora_N2, id_interprete, interprete_colaboradores, nombre_interprete, inserciones, universo, 
        cobertura, cob, contactos, grp_s, ots, ola, fecha_peticion, rango, rango_sort_order, fecha
        FROM dataglobalproduccion.BI_Artistas_Alt.odec_t`;
      const query = `${queryStr}-${artistId}`;
      // const queryResults = await this.bigQueryRepository.query(instance, query);
      const queryResults = artistas_id_resumen[artistId];

      return queryResults;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Error at getSummaryArtistById repository, error: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllSongsByArtistsById(artistId: string): Promise<any[]> {
    this.logger.log(
      `using ${ArtistAdapterRepository.name} - repository - method: getAllSongsByArtists with id: ${artistId}`,
    );
    try {
      const instance = await this.bigQueryRepository.connectWithBigquery();

      // TODO: UPDATE THIS QUERY
      const queryStr = `SELECT emisora_N1, emisora_N2, id_interprete, interprete_colaboradores, nombre_interprete, inserciones, universo, 
        cobertura, cob, contactos, grp_s, ots, ola, fecha_peticion, rango, rango_sort_order, fecha
        FROM dataglobalproduccion.BI_Artistas_Alt.odec_t`;
      const query = `${queryStr}-${artistId}`;
      // const queryResults = await this.bigQueryRepository.query(instance, query);
      const queryResults = artistas_id_canciones[artistId];

      return queryResults;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Error at getAllSongsByArtistsById repository, error: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getArtistById(artistId: string): Promise<any> {
    this.logger.log(
      `using ${ArtistAdapterRepository.name} - repository - method: getArtistById with id: ${artistId}`,
    );

    try {
      const instance = await this.bigQueryRepository.connectWithBigquery();

      // TODO: Update this query
      const queryStr = `SELECT emisora_N1, emisora_N2, id_interprete, interprete_colaboradores, nombre_interprete, inserciones, universo, 
        cobertura, cob, contactos, grp_s, ots, ola, fecha_peticion, rango, rango_sort_order, fecha
        FROM dataglobalproduccion.BI_Artistas_Alt.odec_t`;
      const query = `${queryStr} - ${artistId}`;
      // const queryResults = await this.bigQueryRepository.query(instance, query);
      const queryResults = artist_id[artistId];

      return queryResults;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Error at getArtistById repository, error: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
