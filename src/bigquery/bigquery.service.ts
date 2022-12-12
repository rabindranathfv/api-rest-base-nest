import { Injectable, Logger } from '@nestjs/common';
import { BigQuery } from '@google-cloud/bigquery';
import { OAuth2Client } from 'google-auth-library';
// import GCPCredentiales from '../../auth-connection-bigquery.json';

@Injectable()
export class BigqueryService {
  private readonly logger = new Logger(BigqueryService.name);

  async login(gcpCred: any) {
    this.logger.log(`login BigQuery Service`);
    try {
      console.log(
        '🚀 ~ file: bigquery.service.ts:10 ~ BigqueryService ~ login ~ gcpCred',
        gcpCred,
      );

      // this.logger.log('************ GCO CREDENTIALS***', GCPCredentiales);
    } catch (error) {
      console.log(error);
    }
  }
}
