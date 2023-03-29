/* istanbul ignore file */
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

import { Redis } from 'ioredis';
import { DEFAULT_REDIS_NAMESPACE, InjectRedis } from '@liaoliaots/nestjs-redis';
import { ArtistRepository } from './artist.repository';

import artistas_id_resumen from '../mocks/artistas_id_resumen.json';
import artistas_id_canciones from '../mocks/artistas_id_canciones.json';
import artistas_id_kpi_radio from '../mocks/artistas_id_kpi_radio.json';
// import artistas from '../mocks/artistas.json';
import globalStore from '../../global-mock/store.json';
import { uuid } from 'uuidv4';

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
      // const queryResults = artistas;
      const queryResults = globalStore.artistas.map((artist) => {
        return {
          artist_name: artist.nombre,
          image: artist.image,
          record_company: artist.discografica.nombre,
          total_songs: artist.cantidad_de_canciones,
          id: uuid(),
          streams: artist.kpi.streams.total,
          stream_percentage: artist.kpi.streams.porcentaje,
          toucheds: artist.kpi.tocadas.total,
          toucheds_percentage: artist.kpi.tocadas.porcentaje,
          kpis: {
            compactKpi: [
              {
                categories: [
                  'Jan',
                  'Feb',
                  'Mar',
                  'Apr',
                  'May',
                  'Jun',
                  'Jul',
                  'Aug',
                  'Sep',
                  'Oct',
                  'Nov',
                  'Dec',
                ],
                dataSet: [
                  {
                    name: 'tocadas',
                    data: [...artist.kpi.tocadas.data],
                  },
                ],
              },
              {
                categories: [
                  'Jan',
                  'Feb',
                  'Mar',
                  'Apr',
                  'May',
                  'Jun',
                  'Jul',
                  'Aug',
                  'Sep',
                  'Oct',
                  'Nov',
                  'Dec',
                ],
                dataSet: [
                  {
                    name: 'streams',
                    data: [...artist.kpi.streams.data],
                  },
                ],
              },
            ],
          },
        };
      });

      return { artists: [...queryResults] };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Error at getAllArtists repository, error: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
