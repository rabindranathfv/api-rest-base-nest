/* istanbul ignore file */
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';

import { Redis } from 'ioredis';
import { DEFAULT_REDIS_NAMESPACE, InjectRedis } from '@liaoliaots/nestjs-redis';
import { ArtistRepository } from './artist.repository';

// import artistas_id_resumen from '../mocks/artistas_id_resumen.json';
import artistas_id_canciones from '../mocks/artistas_id_canciones.json';
// import artistas_id_kpi_radio from '../mocks/artistas_id_kpi_radio.json';
// import artistas from '../mocks/artistas.json';
import globalStore from '../../global-mock/store.json';
import { addIndexData } from 'src/helpers/index-redis';
import { bindTopSongId } from 'src/helpers/bind-top-song-id';

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
      // const queryResults = artistas_id_kpi_radio[artistId];
      const newStore = addIndexData(globalStore.artistas);
      const artistData = newStore.find((artist) => artist.id === artistId);
      // TODO: CHECK IF artistData is null

      const queryResults = {
        kpi_station: {
          categories: artistData.kpi_emisora.map((kpi) => kpi.nombre),
          dataSet: [
            {
              name: 'cobertura',
              data: artistData.kpi_emisora.map((kpi) => kpi.cobertura),
            },
          ],
        },
      };

      console.log(
        '🚀 ~ file: artist-adapter.repository.ts:94 ~ ArtistAdapterRepository ~ queryResults ~ queryResults:',
        queryResults,
      );

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
      // const queryResults = artistas_id_resumen[artistId];
      const newStore = addIndexData(globalStore.artistas);
      const artistData = newStore.find((artist) => artist.id === artistId);
      // TODO: Generate error if there is no artist with this ID
      const artistSummary = bindTopSongId(artistData);

      const queryResults = {
        artist_name: artistSummary.nombre,
        image: artistSummary.image,
        record_company: artistSummary.discografica.nombre,
        total_songs: artistSummary.cantidad_de_canciones,
        id: artistSummary.id,
        streams: artistSummary.kpi.streams.total,
        toucheds: artistSummary.kpi.tocadas.total,
        ...(artistSummary.top_cancion && {
          top_song: {
            name: artistSummary.top_cancion.nombre,
            id: artistSummary.top_cancion.id,
            image: artistSummary.image,
            streams: artistSummary.top_cancion.streams,
            toucheds: artistSummary.top_cancion.tocada,
          },
        }),
        kpis_basics: {
          toucheds: {
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
            dataSet: {
              data: [...artistSummary.kpi.tocadas.data],
            },
          },
          streams: {
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
            dataSet: {
              data: [...artistSummary.kpi.streams.data],
            },
          },
        },
      };

      return queryResults;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Error at getSummaryArtistById repository, error: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllSongsByArtistsById(artistId: string): Promise<any> {
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
      // const queryResults = artistas_id_canciones[artistId];
      const newStore = addIndexData(globalStore.artistas);
      const artistData = newStore.find((artist) => artist.id === artistId);

      const queryResults = artistData.albunes
        .map((albun) => {
          const infoSongs = albun.canciones.map((song) => {
            return {
              artist_name: artistData.nombre,
              image: artistData.image,
              record_company: artistData.discografica.nombre,
              id: song.id,
              song_name: song.nombre,
              streams: song.kpi.streams.total,
              stream_percentage: song.kpi.streams.porcentaje,
              toucheds: song.kpi.tocadas.total,
              toucheds_percentage: song.kpi.tocadas.porcentaje,
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
                        data: [...song.kpi.tocadas.data],
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
                        data: [...song.kpi.streams.data],
                      },
                    ],
                  },
                ],
                generalKpi: {
                  dataSet: [
                    {
                      name: 'cobertura',
                      data: [...song.kpi.tocadas.data],
                    },
                    {
                      name: 'streams',
                      data: [...song.kpi.streams.data.map((kpi) => kpi * 10)],
                    },
                  ],
                },
              },
            };
          });

          return infoSongs;
        })
        .flatMap((song) => song);

      return { songs: [...queryResults] };
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

      const newStore = addIndexData(globalStore.artistas);

      const queryResults = newStore.map((artist) => {
        return {
          artist_name: artist.nombre,
          image: artist.image,
          record_company: artist.discografica.nombre,
          total_songs: artist.cantidad_de_canciones,
          id: artist.id,
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
