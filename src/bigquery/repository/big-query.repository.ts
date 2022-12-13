import { BigQuery } from '@google-cloud/bigquery';

export const BIG_QUERY_REPOSITORY = 'BigQueryRepository';

export interface BigQueryRepository {
  check(queryStr: string): Promise<any> | null;
  connectWithGCP(): Promise<BigQuery>;
  query(bgQueryAdapter: BigQuery, queryStr: string): any;
}
