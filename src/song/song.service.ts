import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { SONG_REPOSITORY } from './repository/song.repository';

@Injectable()
export class SongService {
  private readonly logger = new Logger(SongService.name);

  constructor(@Inject(SONG_REPOSITORY) private readonly songRepository) {}

  async getSongById(id: string): Promise<any> {
    this.logger.log(`${SongService.name} - findDiscographicById`);
    try {
      const queryResults = await this.songRepository.getSongById(id);

      return queryResults;
    } catch (error) {
      this.logger.log(`${SongService.name} - getSongById -  ERROR`, error);
      throw new HttpException(
        `Error make query getSongById`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getSummarySongById(id: string): Promise<any> {
    this.logger.log(`${SongService.name} - getSummarySongById`);
    try {
      const queryResults = await this.songRepository.getSummarySongById(id);

      return queryResults;
    } catch (error) {
      this.logger.log(
        `${SongService.name} - getSummarySongById -  ERROR`,
        error,
      );
      throw new HttpException(
        `Error make query getSummarySongById`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getKpiRadioSongById(id: string): Promise<any> {
    this.logger.log(`${SongService.name} - getKpiRadioSongById`);
    try {
      const queryResults = await this.songRepository.getKpiRadioSongById(id);

      return queryResults;
    } catch (error) {
      this.logger.log(
        `${SongService.name} - getKpiRadioSongById -  ERROR`,
        error,
      );
      throw new HttpException(
        `Error make query getKpiRadioSongById`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getKpisSongById(id: string): Promise<any> {
    this.logger.log(`${SongService.name} - getKpisSongById`);
    try {
      const queryResults = await this.songRepository.getKpisSongById(id);

      return queryResults;
    } catch (error) {
      this.logger.log(`${SongService.name} - getKpisSongById -  ERROR`, error);
      throw new HttpException(
        `Error make query getKpisSongById`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
