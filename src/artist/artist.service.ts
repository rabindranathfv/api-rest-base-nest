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
      const queryResults = await this.artistRepository.getAllArtists(query);

      return queryResults;
    } catch (error) {
      this.logger.log(`${ArtistService.name} - getAllArtists -  ERROR`, error);
      throw new HttpException(
        `Error make query`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllSongsByArtists(artistId: string): Promise<any[]> {
    this.logger.log(
      `${ArtistService.name} - getAllSongsByArtists with id ${artistId}`,
    );
    try {
      const queryResults = await this.artistRepository.getAllSongsByArtists(
        artistId,
      );

      return queryResults;
    } catch (error) {
      this.logger.log(
        `${ArtistService.name} - getAllSongsByArtists -  ERROR`,
        error,
      );
      throw new HttpException(
        `Error make query`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getArtistSummary(artistId: string): Promise<any> {
    this.logger.log(
      `${ArtistService.name} - getArtistSummary with id ${artistId}`,
    );
    try {
      const queryResults = await this.artistRepository.getArtistSummary(
        artistId,
      );

      return queryResults;
    } catch (error) {
      this.logger.log(
        `${ArtistService.name} - getArtistSummary -  ERROR`,
        error,
      );
      throw new HttpException(
        `Error make query`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getArtistKpi(artistId: string): Promise<any> {
    this.logger.log(`${ArtistService.name} - getArtistKpi with id ${artistId}`);
    try {
      const queryResults = await this.artistRepository.getArtistKpi(artistId);

      return queryResults;
    } catch (error) {
      this.logger.log(`${ArtistService.name} - getArtistKpi -  ERROR`, error);
      throw new HttpException(
        `Error make query`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getArtistRadioStationKpi(artistId: string): Promise<any> {
    this.logger.log(
      `${ArtistService.name} - getArtistRadioStationKpi with id ${artistId}`,
    );
    try {
      const queryResults = await this.artistRepository.getArtistRadioStationKpi(
        artistId,
      );

      return queryResults;
    } catch (error) {
      this.logger.log(
        `${ArtistService.name} - getArtistRadioStationKpi -  ERROR`,
        error,
      );
      throw new HttpException(
        `Error make query`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getArtistById(artistId: string): Promise<any> {
    this.logger.log(`${ArtistService.name} - getArtistById`);
    try {
      const queryResults = await this.artistRepository.getArtistById(artistId);

      return queryResults;
    } catch (error) {
      this.logger.log(`${ArtistService.name} - getArtistById -  ERROR`, error);
      throw new HttpException(
        `Error make query`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
