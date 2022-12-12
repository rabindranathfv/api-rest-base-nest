import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from 'src/config/configuration';
import { BigqueryController } from './bigquery.controller';
import { BigqueryService } from './bigquery.service';

@Module({
  imports: [ConfigModule.forFeature(configuration)],
  controllers: [BigqueryController],
  providers: [BigqueryService],
})
export class BigqueryModule {}
