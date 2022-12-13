import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  Res,
} from '@nestjs/common';

import { BIG_QUERY_REPOSITORY } from './repository/big-query.repository';

@Injectable()
export class BigqueryService {
  private readonly logger = new Logger(BigqueryService.name);

  constructor(
    @Inject(BIG_QUERY_REPOSITORY) private readonly bigQueryRepository,
  ) {}

  async check(): Promise<any[]> {
    this.logger.log(`check BigQuery Service`);
    try {
      const query = `SELECT emisora_N1, emisora_N2, id_interprete, interprete_colaboradores, nombre_interprete, inserciones, universo, 
      cobertura, cob, contactos, grp_s, ots, ola, fecha_peticion, rango, rango_sort_order, fecha
      FROM dataglobalproduccion.BI_Artistas_Alt.odec_t`;
      const queryResults = await this.bigQueryRepository.check(query);

      return queryResults;
    } catch (error) {
      this.logger.log(`login BigQuery Service ERROR`, error);
      throw new HttpException(
        `Error make query`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
