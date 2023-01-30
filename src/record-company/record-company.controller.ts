import {
  CacheInterceptor,
  Controller,
  Get,
  Logger,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiHeader, ApiResponse } from '@nestjs/swagger';

import { RecordCompanyService } from './record-company.service';

@Controller('discograficas')
// TODO: initial implementation for being compatible with offline mode
// @Controller('record-company')
@ApiTags('record-company')
@ApiHeader({
  name: 'X-Request-id',
  description: 'Custom header for requestId generated automaticly',
})
@UseInterceptors(CacheInterceptor)
export class RecordCompanyController {
  private readonly logger = new Logger(RecordCompanyController.name);

  constructor(private readonly recordCompanyService: RecordCompanyService) {}

  @ApiResponse({
    status: 200,
    description: 'A get for all record companies successfully fetched',
    // type: registerAuth,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @Get()
  async findAllRecordCompanies() {
    this.logger.log(`${RecordCompanyController.name} - findAllRecordCompanies`);
    return await this.recordCompanyService.findAllRecordCompanies();
  }

  @ApiResponse({
    status: 200,
    description: 'A get for a record company by Id successfully fetched',
    // type: registerAuth,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @Get(':id')
  async findRecordCompanyById(@Param('id') id: string) {
    this.logger.log(
      `${RecordCompanyController.name} - findRecordCompanyById for id ${id}`,
    );
    return await this.recordCompanyService.findRecordCompanyById(id);
  }

  @ApiResponse({
    status: 200,
    description: 'A get summary of a record company by Id successfully fetched',
    // type: registerAuth,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  // TODO: This route is not working properly, FIX IT
  @Get(':id/resumen')
  async getSummaryRecordCompanyById(@Param('id') id: string) {
    this.logger.log(
      `${RecordCompanyController.name} - getSummaryRecordCompanyById for id ${id}`,
    );
    // TODO: Update call service here
    return await this.recordCompanyService.getSummaryRecordCompanyById(id);
  }

  @ApiResponse({
    status: 200,
    description:
      'A get record company by Id KPI Radio metrics successfully fetched',
    // type: registerAuth,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  // TODO: This route is not working properly, FIX IT
  @Get(':id/kpiradio')
  async getRecordCompanyByIdKpiRadio(@Param('id') id: string) {
    this.logger.log(
      `${RecordCompanyController.name} - getRecordCompanyByIdKpiRadio for id ${id}`,
    );
    // TODO: Update call service here
    return await this.recordCompanyService.getRecordCompanyByIdKpiRadio(id);
  }

  @ApiResponse({
    status: 200,
    description:
      'A gets Artists list of record company by Id successfully fetched',
    // type: registerAuth,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  // TODO: This route is not working properly, FIX IT
  @Get(':id/artistas')
  async getArtistsRecordCompanyById(@Param('id') id: string) {
    this.logger.log(
      `${RecordCompanyController.name} - getArtistsRecordCompanyById for id ${id}`,
    );
    // TODO: Update call service here
    return await this.recordCompanyService.getArtistsRecordCompanyById(id);
  }
}
