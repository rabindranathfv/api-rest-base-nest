import {
  CacheInterceptor,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiHeader, ApiResponse } from '@nestjs/swagger';

import { SongService } from './song.service';

import { JwtAuthGuard } from './../auth/jwt-auth.guard';

@ApiTags('song')
@UseInterceptors(CacheInterceptor)
@UseGuards(JwtAuthGuard)
@ApiHeader({
  name: 'X-Request-id',
  description: 'Custom header for requestId generated automaticly',
})
@Controller('cancion')
export class SongController {
  private readonly logger = new Logger(SongController.name);

  constructor(private readonly songService: SongService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'A get for a song by Id successfully fetched',
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
  async getSummarySongById(@Param('id') id: string) {
    this.logger.log(`${SongController.name} - getSummarySongById for id ${id}`);
    return await this.songService.getSummarySongById(id);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'A get for a song by Id successfully fetched',
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
  async getKpiRadioSongById(@Param('id') id: string) {
    this.logger.log(
      `${SongController.name} - getKpiRadioSongById for id ${id}`,
    );
    return await this.songService.getKpiRadioSongById(id);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'A get for a song by Id successfully fetched',
    // type: registerAuth,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'tinvalid filter value',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized, does not have a valid token o token is Expired',
  })
  @Get(':id/kpis')
  async getKpisSongById(
    @Param('id') id: string,
    @Query('filter') filter: string,
    @Query('searchText') searchText: string,
  ) {
    this.logger.log(`${SongController.name} - getKpisSongById for id ${id}`);
    return await this.songService.getKpisSongById(id, filter, searchText);
  }
}
