import {
  Res,
  Controller,
  Logger,
  Get,
  HttpStatus,
  CacheInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BigqueryService } from './bigquery.service';

import { Response } from 'express';
import { RadioStation } from './interface/radio-station.interface';
import { TaskDS } from './interface/task.interface';
@ApiBearerAuth()
@ApiTags('bigquery')
@ApiHeader({
  name: 'X-Request-id',
  description: 'Custom header for requestId generated automaticly',
})
@UseInterceptors(CacheInterceptor) // cache for all get methods on this ctrl
@Controller('bigquery')
export class BigqueryController {
  private readonly logger = new Logger(BigqueryController.name);

  constructor(private readonly bigQueryService: BigqueryService) {}

  @Get('check')
  @ApiResponse({
    status: 200,
    description: 'A get for all Users successfully fetched',
    type: [RadioStation],
  })
  async checkBigQuery(@Res() res: Response) {
    this.logger.log(`checkBigQuery bigQueryEndpoint bigQuery Ctrl`);
    const resp = await this.bigQueryService.check();

    if (!resp)
      res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: `query with no results` });

    return res.status(HttpStatus.OK).json(resp);
  }

  @Get('datastore')
  @ApiResponse({
    status: 200,
    description: 'A get for all Users successfully fetched',
    type: [TaskDS],
  })
  async checkDatastore(@Res() res: Response) {
    this.logger.log(`checkDatastore bigQueryEndpoint bigQuery Ctrl`);
    const resp = await this.bigQueryService.checkDatastore();

    if (!resp)
      res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: `query with no results` });

    return res.status(HttpStatus.OK).json(resp);
  }
}
