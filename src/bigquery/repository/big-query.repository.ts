import { BigQuery } from '@google-cloud/bigquery';
import { Datastore } from '@google-cloud/datastore';

export const BIG_QUERY_REPOSITORY = 'BigQueryRepository';

export interface BigQueryRepository {
  check(queryStr: string): Promise<any> | null;
  connectWithBigquery(): Promise<BigQuery>;
  query(bgQueryAdapter: BigQuery, queryStr: string): any;
  connectWithDatastorage(): Promise<Datastore>;
}
