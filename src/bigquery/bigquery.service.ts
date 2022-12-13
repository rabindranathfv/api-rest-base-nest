import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { BigQuery } from '@google-cloud/bigquery';

import GCPCredentiales from '../../auth-connection-bigquery.json';

@Injectable()
export class BigqueryService {
  private readonly logger = new Logger(BigqueryService.name);

  async query(bgQueryAdapter: BigQuery, queryStr: string) {
    const query = `${queryStr}`;

    // For all options, see https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query
    const options = {
      query: query,
      // Location must match that of the dataset(s) referenced in the query.
      location: 'EU',
    };

    // Run the query as a job
    const [job] = await bgQueryAdapter.createQueryJob(options);
    console.log(`Job ${job.id} started.`);

    // Wait for the query to finish
    const [rows] = await job.getQueryResults();

    // rows.forEach((row, index) => console.log(` indix: ${index} `, row));
    return rows;
  }

  async connectWithGCP(): Promise<BigQuery> {
    const credPath = `${process.cwd()}/auth-connection-bigquery.json`;
    const options = {
      keyFilename: credPath,
      projectId: GCPCredentiales.project_id,
    };

    const bigquery: BigQuery = new BigQuery(options);

    return bigquery;
  }

  async check(): Promise<any[]> {
    this.logger.log(`login BigQuery Service`);
    try {
      const instance = await this.connectWithGCP();

      const query = `SELECT emisora_N1, emisora_N2, id_interprete, interprete_colaboradores, nombre_interprete, inserciones, universo, 
      cobertura, cob, contactos, grp_s, ots, ola, fecha_peticion, rango, rango_sort_order, fecha
      FROM dataglobalproduccion.BI_Artistas_Alt.odec_t`;
      const queryResults = await this.query(instance, query);

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
