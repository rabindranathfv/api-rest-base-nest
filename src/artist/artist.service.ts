import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';

import {
  ARTIST_REPOSITORY,
  ArtistRepository,
} from './repository/artist.repository';

@Injectable()
export class ArtistService {
  private readonly logger = new Logger(ArtistService.name);

  constructor(
    @Inject(ARTIST_REPOSITORY)
    private readonly artistRepository: ArtistRepository,
  ) {}

  async getAllArtists(): Promise<any[]> {
    this.logger.log(`${ArtistService.name} - getAllArtists`);
    try {
      const query = `SELECT emisora_N1, emisora_N2, id_interprete, interprete_colaboradores, nombre_interprete, inserciones, universo, 
        cobertura, cob, contactos, grp_s, ots, ola, fecha_peticion, rango, rango_sort_order, fecha
        FROM dataglobalproduccion.BI_Artistas_Alt.odec_t`;
      const queryResults = await this.artistRepository.getAllArtists();

      return queryResults;
    } catch (error) {
      this.logger.log(`${ArtistService.name} - getAllArtists -  ERROR`, error);
      throw new HttpException(
        `Error make query`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllSongsByArtistsById(artistId: string): Promise<any[]> {
    this.logger.log(
      `${ArtistService.name} - getAllSongsByArtistsById with id ${artistId}`,
    );
    try {
      const queryResults = await this.artistRepository.getAllSongsByArtistsById(
        artistId,
      );

      return queryResults;
    } catch (error) {
      this.logger.log(
        `${ArtistService.name} - getAllSongsByArtistsById -  ERROR`,
        error,
      );
      throw new HttpException(
        `Error make query in getAllSongsByArtistsById`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getSummaryArtistById(artistId: string): Promise<any> {
    this.logger.log(
      `${ArtistService.name} - getSummaryArtistById with id ${artistId}`,
    );
    try {
      const queryResults = await this.artistRepository.getSummaryArtistById(
        artistId,
      );

      return queryResults;
    } catch (error) {
      this.logger.log(
        `${ArtistService.name} - getSummaryArtistById -  ERROR`,
        error,
      );
      throw new HttpException(
        `Error make query in getSummaryArtistById`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getKpiRadioArtistById(artistId: string): Promise<any> {
    this.logger.log(
      `${ArtistService.name} - getKpiRadioArtistById with id ${artistId}`,
    );
    try {
      const queryResults = await this.artistRepository.getKpiRadioArtistById(
        artistId,
      );

      return queryResults;
    } catch (error) {
      this.logger.log(
        `${ArtistService.name} - getKpiRadioArtistById -  ERROR`,
        error,
      );
      throw new HttpException(
        `Error make query in getKpiRadioArtistById`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
