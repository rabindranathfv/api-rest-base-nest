import { BigQuery } from '@google-cloud/bigquery';
import { Injectable, Logger } from '@nestjs/common';
import { BigQueryRepository } from './big-query.repository';

import GCPCredentiales from '../../../auth-connection-bigquery.json';

@Injectable()
export class BigQueryAdapterRepository implements BigQueryRepository {
  private readonly logger = new Logger(BigQueryAdapterRepository.name);

  async connectWithGCP(): Promise<BigQuery> {
    this.logger.log(
      `connect with credentials to GCP on ${BigQueryAdapterRepository.name} - repository - connectWithGCP`,
    );
    try {
      const credPath = `${process.cwd()}/auth-connection-bigquery.json`;
      const projectId = GCPCredentiales.project_id;
      const options = {
        keyFilename: credPath,
        projectId: projectId,
      };

      const bigquery: BigQuery = new BigQuery(options);

      return bigquery;
    } catch (error) {
      this.logger.log(
        `error on ${BigQueryAdapterRepository.name} - repository - method: connectWithGCP, ${error}`,
      );
      return null;
    }
  }

  async query(bgQueryAdapter: BigQuery, queryStr: string) {
    this.logger.log(
      `Apply query on ${BigQueryAdapterRepository.name} - repository - method: query`,
    );
    try {
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
    } catch (error) {
      this.logger.log(
        `error on ${BigQueryAdapterRepository.name} - repository - method: query, ${error}`,
      );
      return null;
    }
  }

  async check(queryStr: string): Promise<any> {
    this.logger.log(
      `Apply check GCP on ${BigQueryAdapterRepository.name} - repository - method: check`,
    );
    try {
      const instance = await this.connectWithGCP();

      const query = `${queryStr}`;
      const queryResults = await this.query(instance, query);

      return queryResults;
    } catch (error) {
      return null;
    }
  }
}
