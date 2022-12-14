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

  async getAllSongsByArtists(): Promise<any[]> {
    this.logger.log(`${ArtistService.name} - getAllSongsByArtists`);
    try {
      const query = `SELECT emisora_N1, emisora_N2, id_interprete, interprete_colaboradores, nombre_interprete, inserciones, universo, 
        cobertura, cob, contactos, grp_s, ots, ola, fecha_peticion, rango, rango_sort_order, fecha
        FROM dataglobalproduccion.BI_Artistas_Alt.odec_t`;
      const queryResults = await this.artistRepository.getAllSongsByArtists(
        query,
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

  async getArtistSummary(): Promise<any> {
    this.logger.log(`${ArtistService.name} - getArtistSummary`);
    try {
      const query = `SELECT emisora_N1, emisora_N2, id_interprete, interprete_colaboradores, nombre_interprete, inserciones, universo, 
        cobertura, cob, contactos, grp_s, ots, ola, fecha_peticion, rango, rango_sort_order, fecha
        FROM dataglobalproduccion.BI_Artistas_Alt.odec_t`;
      const queryResults = await this.artistRepository.getArtistSummary(query);

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
}
