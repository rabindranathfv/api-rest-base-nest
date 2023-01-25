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

  @Get()
  @ApiResponse({
    status: 200,
    description: 'get All Artist list',
    // type: [User], ADD CLASS INTERFACE HERE
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async getAllArtists(@Res() res: Response) {
    this.logger.log(`${ArtistController.name} - getAllArtists`);
    const resp = await this.artistService.getAllArtists();

    if (!resp)
      res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: `there is no artists info available` });

    return res.status(HttpStatus.OK).json(resp);
  }

  @Get('/canciones')
  @ApiResponse({
    status: 200,
    description: 'get for all artist filter by song',
    // type: [User], ADD CLASS INTERFACE HERE
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async getAllSongsByArtists(@Res() res: Response, @Param('id') id: string) {
    this.logger.log(
      `${ArtistController.name} - getAllSongsByArtists with id ${id}`,
    );
    const resp = await this.artistService.getAllSongsByArtists(id);

    if (!resp)
      res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: `there is no artists info available` });

    return res.status(HttpStatus.OK).json(resp);
  }

  @Get('/resumen')
  @ApiResponse({
    status: 200,
    description: 'get artist summary info',
    // type: [User], ADD CLASS INTERFACE HERE
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async getArtistSummary(@Res() res: Response, @Param('id') id: string) {
    this.logger.log(
      `${ArtistController.name} - getArtistSummary with id ${id}`,
    );
    const resp = await this.artistService.getArtistSummary(id);

    if (!resp)
      res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: `there is no artists summary info available` });

    return res.status(HttpStatus.OK).json(resp);
  }

  @Get('/kpi')
  @ApiResponse({
    status: 200,
    description: 'get Artist KPI info',
    // type: [User], ADD CLASS INTERFACE HERE
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async getArtistKpi(@Res() res: Response, @Param('id') id: string) {
    this.logger.log(`${ArtistController.name} - getArtistKpi with id ${id}`);
    const resp = await this.artistService.getArtistKpi(id);

    if (!resp)
      res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: `there is no artists kpi info available` });

    return res.status(HttpStatus.OK).json(resp);
  }

  @Get('/radioskpi')
  @ApiResponse({
    status: 200,
    description: 'get Radio station kpi by artist info',
    // type: [User], ADD CLASS INTERFACE HERE
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async getArtistRadioStationKpi(
    @Res() res: Response,
    @Param('id') id: string,
  ) {
    this.logger.log(
      `${ArtistController.name} - getArtistRadioStationKpi with id ${id}`,
    );
    const resp = await this.artistService.getArtistRadioStationKpi(id);

    if (!resp)
      res.status(HttpStatus.NOT_FOUND).json({
        message: `there is no artists radio stations kpi info available`,
      });

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
}
