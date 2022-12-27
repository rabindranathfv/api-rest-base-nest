import { ArtistService } from './artist.service';
import {
  CacheInterceptor,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('artist')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(CacheInterceptor)
@ApiHeader({
  name: 'X-Request-id',
  description: 'Custom header for requestId generated automaticly',
})
@Controller('artist')
export class ArtistController {
  private readonly logger = new Logger(ArtistController.name);

  constructor(private readonly artistService: ArtistService) {}

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

  @Get('/songs')
  async getAllSongsByArtists(@Res() res: Response) {
    this.logger.log(`${ArtistController.name} - getAllSongsByArtists`);
    const resp = await this.artistService.getAllSongsByArtists();

    if (!resp)
      res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: `there is no artists info available` });

    return res.status(HttpStatus.OK).json(resp);
  }

  @Get('/summary')
  async getArtistSummary(@Res() res: Response) {
    this.logger.log(`${ArtistController.name} - getArtistSummary`);
    const resp = await this.artistService.getArtistSummary();

    if (!resp)
      res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: `there is no artists summary info available` });

    return res.status(HttpStatus.OK).json(resp);
  }

  @Get('/kpi')
  async getArtistKpi(@Res() res: Response) {
    this.logger.log(`${ArtistController.name} - getArtistKpi`);
    const resp = await this.artistService.getArtistKpi();

    if (!resp)
      res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: `there is no artists kpi info available` });

    return res.status(HttpStatus.OK).json(resp);
  }

  @Get('/stationskpi')
  async getArtistRadioStationKpi(@Res() res: Response) {
    this.logger.log(`${ArtistController.name} - getArtistRadioStationKpi`);
    const resp = await this.artistService.getArtistRadioStationKpi();

    if (!resp)
      res.status(HttpStatus.NOT_FOUND).json({
        message: `there is no artists radio stations kpi info available`,
      });

    return res.status(HttpStatus.OK).json(resp);
  }
}
