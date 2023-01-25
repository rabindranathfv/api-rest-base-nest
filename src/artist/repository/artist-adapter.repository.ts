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

import { radioStationStadistic } from './../mocks/radioStationKPI';
import { artistKpiOverview } from './../mocks/artistKpiOverview';
import { artistsMockData } from '../mocks/artistsMock';
import { songsByartistsMockData } from '../mocks/songsByArtist';
import { artistDetailMockData } from '../mocks/artistDetailMock';

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

  async getArtistRadioStationKpi(artistId: string): Promise<any> {
    this.logger.log(
      `using ${ArtistAdapterRepository.name} - repository - method: getArtistRadioStationKpi with id: ${artistId}`,
    );
    try {
      const instance = await this.bigQueryRepository.connectWithBigquery();

      // TODO: UPDATE THIS QUERY
      const queryStr = `SELECT emisora_N1, emisora_N2, id_interprete, interprete_colaboradores, nombre_interprete, inserciones, universo, 
        cobertura, cob, contactos, grp_s, ots, ola, fecha_peticion, rango, rango_sort_order, fecha
        FROM dataglobalproduccion.BI_Artistas_Alt.odec_t`;
      const query = `${queryStr}-${artistId}`;
      // const queryResults = await this.bigQueryRepository.query(instance, query);
      const queryResults = radioStationStadistic;

      return queryResults;
    } catch (error) {
      return null;
    }
  }

  async getArtistKpi(artistId: string): Promise<any> {
    this.logger.log(
      `using ${ArtistAdapterRepository.name} - repository - method: getArtistKpi with id: ${artistId}`,
    );
    try {
      const instance = await this.bigQueryRepository.connectWithBigquery();

      // TODO: UPDATE THIS QUERY
      const queryStr = `SELECT emisora_N1, emisora_N2, id_interprete, interprete_colaboradores, nombre_interprete, inserciones, universo, 
        cobertura, cob, contactos, grp_s, ots, ola, fecha_peticion, rango, rango_sort_order, fecha
        FROM dataglobalproduccion.BI_Artistas_Alt.odec_t`;
      const query = `${queryStr}-${artistId}`;
      // const queryResults = await this.bigQueryRepository.query(instance, query);
      const queryResults = artistKpiOverview;

      return queryResults;
    } catch (error) {
      return null;
    }
  }

  async getArtistSummary(artistId: string): Promise<any> {
    this.logger.log(
      `using ${ArtistAdapterRepository.name} - repository - method: getArtistSummary with id: ${artistId}`,
    );
    try {
      const instance = await this.bigQueryRepository.connectWithBigquery();

      // TODO: UPDATE THIS QUERY
      const queryStr = `SELECT emisora_N1, emisora_N2, id_interprete, interprete_colaboradores, nombre_interprete, inserciones, universo, 
        cobertura, cob, contactos, grp_s, ots, ola, fecha_peticion, rango, rango_sort_order, fecha
        FROM dataglobalproduccion.BI_Artistas_Alt.odec_t`;
      const query = `${queryStr}-${artistId}`;
      // const queryResults = await this.bigQueryRepository.query(instance, query);
      const queryResults = artistDetailMockData;

      return queryResults;
    } catch (error) {
      return null;
    }
  }

  async getAllSongsByArtists(artistId: string): Promise<any[]> {
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
      const queryResults = songsByartistsMockData;

      return queryResults;
    } catch (error) {
      return null;
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
        `Error at findSongById repository, error: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
