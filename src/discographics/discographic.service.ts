import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { DISCOGRAPHIC_REPOSITORY } from './repository/discographic.repository';

@Injectable()
export class DiscographicService {
  private readonly logger = new Logger(DiscographicService.name);

  constructor(
    @Inject(DISCOGRAPHIC_REPOSITORY) private readonly discographicRepository,
  ) {}

  async findAllDiscographics(): Promise<any> {
    this.logger.log(`${DiscographicService.name} - findAllDiscographics`);
    try {
      // TODO: UPDATE THIS QUERY
      const query = `SELECT emisora_N1, emisora_N2, id_interprete, interprete_colaboradores, nombre_interprete, inserciones, universo, 
        cobertura, cob, contactos, grp_s, ots, ola, fecha_peticion, rango, rango_sort_order, fecha
        FROM dataglobalproduccion.BI_Artistas_Alt.odec_t`;
      const queryResults =
        await this.discographicRepository.findAllDiscographics(query);

      return queryResults;
    } catch (error) {
      this.logger.log(
        `${DiscographicService.name} - findAllDiscographics -  ERROR`,
        error,
      );
      throw new HttpException(
        `Error make query`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findDiscographicById(id: string): Promise<any> {
    this.logger.log(`${DiscographicService.name} - findDiscographicById`);
    try {
      // TODO: UPDATE THIS QUERY
      const query = `SELECT emisora_N1, emisora_N2, id_interprete, interprete_colaboradores, nombre_interprete, inserciones, universo, 
        cobertura, cob, contactos, grp_s, ots, ola, fecha_peticion, rango, rango_sort_order, fecha
        FROM dataglobalproduccion.BI_Artistas_Alt.odec_t`;
      const queryResults =
        await this.discographicRepository.findDiscographicById(query, id);

      return queryResults;
    } catch (error) {
      this.logger.log(
        `${DiscographicService.name} - findDiscographicById -  ERROR`,
        error,
      );
      throw new HttpException(
        `Error make query`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
