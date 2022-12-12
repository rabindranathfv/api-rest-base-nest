import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { BigqueryService } from './bigquery.service';

@ApiTags('bigquery')
@ApiHeader({
  name: 'X-Request-id',
  description: 'Custom header for requestId generated automaticly',
})
@Controller('bigquery')
export class BigqueryController {
  private readonly logger = new Logger(BigqueryController.name);

  constructor(private readonly bigQueryService: BigqueryService) {}

  @Post('login')
  async login(@Body() body: any) {
    this.logger.log(`Login bigQueryEndpoint bigQuery Ctrl`);
    return await this.bigQueryService.login(body);
  }
}
