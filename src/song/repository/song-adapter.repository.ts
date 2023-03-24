/* istanbul ignore file */
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';
import { DEFAULT_REDIS_NAMESPACE, InjectRedis } from '@liaoliaots/nestjs-redis';

import { SongRepository } from './song.repository';

import canciones_id_resumen from '../mock/canciones_id_resumen.json';
import canciones_id_kpi_radio from '../mock/canciones_id_kpi_radio.json';
import canciones_id_kpis from '../mock/canciones_id_kpis.json';

@Injectable()
export class SongAdapterRepository implements SongRepository {
  private readonly logger = new Logger(SongAdapterRepository.name);

  constructor(
    @InjectRedis(DEFAULT_REDIS_NAMESPACE) private readonly redis: Redis,
  ) {}

  async getSummarySongById(id: string): Promise<any> {
    this.logger.log(
      `using ${SongAdapterRepository.name} - repository - method: getSummarySongById with id: ${id}`,
    );

    try {
      const queryResults = canciones_id_resumen[id];
      console.log(
        '🚀 ~ file: song-adapter.repository.ts:66 ~ SongAdapterRepository ~ getSummarySongById ~ queryResults',
        queryResults,
      );

      return queryResults;
    } catch (error) {
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

  async getKpisSongById(id: string, filter = ''): Promise<any> {
    this.logger.log(
      `using ${SongAdapterRepository.name} - repository - method: getKpisSongById with id: ${id}`,
    );

    try {
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
