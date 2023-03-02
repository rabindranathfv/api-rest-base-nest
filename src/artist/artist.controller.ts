import {
  CacheInterceptor,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  Query,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ArtistService } from './artist.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('artist')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(CacheInterceptor)
@ApiHeader({
  name: 'X-Request-id',
  description: 'Custom header for requestId generated automaticly',
})
@Controller('artistas')
export class ArtistController {
  private readonly logger = new Logger(ArtistController.name);

  constructor(private readonly artistService: ArtistService) {}

  @ApiResponse({
    status: 200,
    description: 'get artist by id with all songs',
    // type: [User], ADD CLASS INTERFACE HERE
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'there is no artists info available',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'invalid filter value',
  })
  @Get(':id/canciones')
  async getAllSongsByArtistsById(
    @Res() res: Response,
    @Param('id') id: string,
    @Query('filter') filter: string,
    @Query('searchText') searchText: string,
  ) {
    this.logger.log(
      `${ArtistController.name} -  getAllSongsByArtistsById with id ${id}`,
    );
    const resp = await this.artistService.getAllSongsByArtistsById(
      id,
      filter,
      searchText,
    );

    if (!resp)
      res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: `there is no artists info available` });

    return res.status(HttpStatus.OK).json(resp);
  }

  @ApiResponse({
    status: 200,
    description: 'get artist summary info',
    // type: [User], ADD CLASS INTERFACE HERE
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'there is no artists summary info available',
  })
  @Get(':id/resumen')
  async getSummaryArtistById(@Res() res: Response, @Param('id') id: string) {
    this.logger.log(
      `${ArtistController.name} - getSummaryArtistById with id ${id}`,
    );
    const resp = await this.artistService.getSummaryArtistById(id);

    if (!resp)
      res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: `there is no artists summary info available` });

    return res.status(HttpStatus.OK).json(resp);
  }

  @ApiResponse({
    status: 200,
    description: 'get Radio station kpi by artist info',
    // type: [User], ADD CLASS INTERFACE HERE
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'there is no artists radio stations kpi info available',
  })
  @Get(':id/kpiradio')
  async getKpiRadioArtistById(@Res() res: Response, @Param('id') id: string) {
    this.logger.log(
      `${ArtistController.name} - getKpiRadioArtistById with id ${id}`,
    );
    const resp = await this.artistService.getKpiRadioArtistById(id);

    if (!resp)
      res.status(HttpStatus.NOT_FOUND).json({
        message: `there is no artists radio stations kpi info available`,
      });

    return res.status(HttpStatus.OK).json(resp);
  }

  @ApiResponse({
    status: 200,
    description: 'get all artist',
    // type: [User], ADD CLASS INTERFACE HERE
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'invalid filter value',
  })
  @Get('')
  async getAllArtists(
    @Query('filter') filter: string,
    @Query('searchText') searchText: string,
  ) {
    this.logger.log(`${ArtistController.name} - getAllArtists`);
    return await this.artistService.getAllArtists(filter, searchText);
  }
}
