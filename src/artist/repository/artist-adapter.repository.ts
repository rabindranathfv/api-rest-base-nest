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
import { ArtistRepository } from './artist.repository';

import artistas_id_resumen from '../mocks/artistas_id_resumen.json';
import artistas_id_canciones from '../mocks/artistas_id_canciones.json';
import artistas_id_kpi_radio from '../mocks/artistas_id_kpi_radio.json';
import artistas from '../mocks/artistas.json';

@Injectable()
export class ArtistAdapterRepository implements ArtistRepository {
  private readonly logger = new Logger(ArtistAdapterRepository.name);

  constructor(
    @InjectRedis(DEFAULT_REDIS_NAMESPACE) private readonly redis: Redis,
  ) {}

  async getKpiRadioArtistById(
    artistId: string,
    filter = '',
    searchText = '',
  ): Promise<any> {
    this.logger.log(
      `using ${ArtistAdapterRepository.name} - repository - method: getKpiRadioArtistById with id: ${artistId}`,
    );
    try {
      const query = `${artistId}-${filter}-${searchText}`;

      console.log(
        '🚀 ~ file: artist-adapter.repository.ts:38 ~ ArtistAdapterRepository ~ query:',
        query,
      );
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
      const query = `${artistId}`;
      // const queryResults = await this.bigQueryRepository.query(instance, query);
      console.log(
        '🚀 ~ file: artist-adapter.repository.ts:58 ~ ArtistAdapterRepository ~ getSummaryArtistById ~ query:',
        query,
      );
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
      const query = `${artistId}`;
      // const queryResults = await this.bigQueryRepository.query(instance, query);
      console.log(
        '🚀 ~ file: artist-adapter.repository.ts:81 ~ ArtistAdapterRepository ~ getAllSongsByArtistsById ~ query:',
        query,
      );
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

  async getAllArtists(filter = '', searchText = ''): Promise<any> {
    this.logger.log(
      `using ${ArtistAdapterRepository.name} - repository - method: getAllArtists`,
    );
    try {
      const query = `${filter}-${searchText}`;
      console.log(
        '🚀 ~ file: artist-adapter.repository.ts:104 ~ ArtistAdapterRepository ~ getAllArtists ~ query:',
        query,
      );
      const queryResults = artistas;

      return queryResults;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Error at getAllArtists repository, error: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
