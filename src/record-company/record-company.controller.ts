import {
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiHeader, ApiResponse } from '@nestjs/swagger';

import { RecordCompanyService } from './record-company.service';

import { JwtAuthGuard } from './../auth/jwt-auth.guard';

@ApiTags('record-company')
@UseGuards(JwtAuthGuard)
@ApiHeader({
  name: 'X-Request-id',
  description: 'Custom header for requestId generated automaticly',
})
// @Controller('record-company')
@Controller('discograficas')
export class RecordCompanyController {
  private readonly logger = new Logger(RecordCompanyController.name);

  constructor(private readonly recordCompanyService: RecordCompanyService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'A get for all record companies successfully fetched',
    // type: registerAuth,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'invalid filter value',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized, does not have a valid token o token is Expired',
  })
  @Get()
  async findAllRecordCompanies(
    @Query('filter') filter: string,
    @Query('searchText') searchText: string,
  ) {
    this.logger.log(`${RecordCompanyController.name} - findAllRecordCompanies`);
    return await this.recordCompanyService.findAllRecordCompanies(
      filter,
      searchText,
    );
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'A get summary of a record company by Id successfully fetched',
    // type: registerAuth,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized, does not have a valid token o token is Expired',
  })
  @Get(':id/resumen')
  async getSummaryRecordCompanyById(@Param('id') id: string) {
    this.logger.log(
      `${RecordCompanyController.name} - getSummaryRecordCompanyById for id ${id}`,
    );
    return await this.recordCompanyService.getSummaryRecordCompanyById(id);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'A get record company by Id KPI Radio metrics successfully fetched',
    // type: registerAuth,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized, does not have a valid token o token is Expired',
  })
  @Get(':id/kpiradio')
  async getRecordCompanyByIdKpiRadio(@Param('id') id: string) {
    this.logger.log(
      `${RecordCompanyController.name} - getRecordCompanyByIdKpiRadio for id ${id}`,
    );
    return await this.recordCompanyService.getRecordCompanyByIdKpiRadio(id);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'A gets Artists list of record company by Id successfully fetched',
    // type: registerAuth,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'invalid filter value',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized, does not have a valid token o token is Expired',
  })
  @Get(':id/artistas')
  async getArtistsRecordCompanyById(
    @Param('id') id: string,
    @Query('filter') filter: string,
    @Query('searchText') searchText: string,
  ) {
    this.logger.log(
      `${RecordCompanyController.name} - getArtistsRecordCompanyById for id ${id}`,
    );
    return await this.recordCompanyService.getArtistsRecordCompanyById(
      id,
      filter,
      searchText,
    );
  }
}
