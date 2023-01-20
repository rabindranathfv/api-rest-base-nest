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

  async findSongById(id: string): Promise<any> {
    this.logger.log(`${SongService.name} - findDiscographicById`);
    try {
      // TODO: UPDATE THIS QUERY
      const query = `SELECT emisora_N1, emisora_N2, id_interprete, interprete_colaboradores, nombre_interprete, inserciones, universo, 
        cobertura, cob, contactos, grp_s, ots, ola, fecha_peticion, rango, rango_sort_order, fecha
        FROM dataglobalproduccion.BI_Artistas_Alt.odec_t`;
      const queryResults = await this.songRepository.findSongById(query, id);

      return queryResults;
    } catch (error) {
      this.logger.log(`${SongService.name} - findSongById -  ERROR`, error);
      throw new HttpException(
        `Error make query findSongById`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
