import { BIG_QUERY_REPOSITORY } from 'src/bigquery/repository/big-query.repository';
import { Inject, Injectable, Logger } from '@nestjs/common';

import { ArtistRepository } from './artist.repository';
import { artistsMockData } from '../mocks/artists.mock';
import { songsByartistsMockData } from '../mocks/songsByArtist';
import { artistDetailMockData } from '../mocks/artistDetailMock';

@Injectable()
export class ArtistAdapterRepository implements ArtistRepository {
  private readonly logger = new Logger(ArtistAdapterRepository.name);

  constructor(
    @Inject(BIG_QUERY_REPOSITORY) private readonly bigQueryRepository,
  ) {}

  async getArtistSummary(queryStr: string): Promise<any> {
    this.logger.log(
      `Apply check GCP on ${ArtistAdapterRepository.name} - repository - method: getAllArtists`,
    );
    try {
      const instance = await this.bigQueryRepository.connectWithGCP();

      const query = `${queryStr}`;
      // const queryResults = await this.bigQueryRepository.query(instance, query);
      const queryResults = artistDetailMockData;

      return queryResults;
    } catch (error) {
      return null;
    }
  }

  async getAllArtists(queryStr: string): Promise<any[]> {
    this.logger.log(
      `Apply check GCP on ${ArtistAdapterRepository.name} - repository - method: getAllArtists`,
    );
    try {
      const instance = await this.bigQueryRepository.connectWithGCP();

      const query = `${queryStr}`;
      // const queryResults = await this.bigQueryRepository.query(instance, query);
      const queryResults = artistsMockData;

      return queryResults;
    } catch (error) {
      return null;
    }
  }

  async getAllSongsByArtists(queryStr: string): Promise<any[]> {
    this.logger.log(
      `Apply check GCP on ${ArtistAdapterRepository.name} - repository - method: getAllSongsByArtists`,
    );
    try {
      const instance = await this.bigQueryRepository.connectWithGCP();

      const query = `${queryStr}`;
      // const queryResults = await this.bigQueryRepository.query(instance, query);
      const queryResults = songsByartistsMockData;

      return queryResults;
    } catch (error) {
      return null;
    }
  }
}
