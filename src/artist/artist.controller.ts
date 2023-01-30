import { ArtistService } from './artist.service';
import {
  CacheInterceptor,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('artist')
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
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
    description: 'get All Artist list',
    // type: [User], ADD CLASS INTERFACE HERE
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @Get()
  async getAllArtists(@Res() res: Response) {
    this.logger.log(`${ArtistController.name} - getAllArtists`);
    const resp = await this.artistService.getAllArtists();

    if (!resp)
      res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: `there is no artists info available` });

    return res.status(HttpStatus.OK).json(resp);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'get artist by Id',
    // type: [User], ADD CLASS INTERFACE HERE
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async getArtistById(@Res() res: Response, @Param('id') id: string) {
    this.logger.log(
      `${ArtistController.name} - getArtistRadioStationKpi with id ${id}`,
    );
    const resp = await this.artistService.getArtistById(id);

    if (!resp)
      res.status(HttpStatus.NOT_FOUND).json({
        message: `there is no artists radio stations kpi info available`,
      });

    return res.status(HttpStatus.OK).json(resp);
  }

  @ApiResponse({
    status: 200,
    description: 'get artist by id with all songs',
    // type: [User], ADD CLASS INTERFACE HERE
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @Get(':id/canciones')
  async getAllSongsByArtistsById(
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    this.logger.log(
      `${ArtistController.name} -  getAllSongsByArtistsById with id ${id}`,
    );
    const resp = await this.artistService.getAllSongsByArtistsById(id);

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
}
