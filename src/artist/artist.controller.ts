import { ArtistService } from './artist.service';
import { Controller, Get, HttpStatus, Logger, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('artists')
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
}
