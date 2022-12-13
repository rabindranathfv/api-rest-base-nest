import { Res, Controller, Logger, Get } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { BigqueryService } from './bigquery.service';

import { Response } from 'express';
@ApiTags('bigquery')
@ApiHeader({
  name: 'X-Request-id',
  description: 'Custom header for requestId generated automaticly',
})
@Controller('bigquery')
export class BigqueryController {
  private readonly logger = new Logger(BigqueryController.name);

  constructor(private readonly bigQueryService: BigqueryService) {}

  @Get('check')
  async login(@Res() res: Response) {
    this.logger.log(`Login bigQueryEndpoint bigQuery Ctrl`);
    const resp = await this.bigQueryService.check();
    console.log(
      '🚀 ~ file: bigquery.controller.ts:20 ~ BigqueryController ~ login ~ resp',
      resp,
    );

    return res.status(201).json(resp);
  }
}
