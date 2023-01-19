import {
  Body,
  CacheInterceptor,
  Controller,
  Get,
  Logger,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';

import { DiscographicService } from './discographic.service';

@Controller('discographic')
@ApiTags('discographic')
@ApiHeader({
  name: 'X-Request-id',
  description: 'Custom header for requestId generated automaticly',
})
@UseInterceptors(CacheInterceptor)
export class DiscographicController {
  private readonly logger = new Logger(DiscographicController.name);

  constructor(private readonly discographicService: DiscographicService) {}

  @ApiResponse({
    status: 200,
    description: 'A get for all Discographics successfully fetched',
    // type: registerAuth,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @Get()
  async findAllDiscographics() {
    this.logger.log(`${DiscographicController.name} - findAllDiscographics`);
    return await this.discographicService.findAllDiscographics();
  }

  @ApiResponse({
    status: 200,
    description: 'A get for all Discographic by Id successfully fetched',
    // type: registerAuth,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @Get(':id')
  async findDiscographicById(@Param('id') id: string) {
    this.logger.log(
      `${DiscographicController.name} - findDiscographicById for id ${id}`,
    );
    return await this.discographicService.findDiscographicById(id);
  }
}
