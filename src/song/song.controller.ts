import {
  CacheInterceptor,
  Controller,
  Get,
  Logger,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiHeader, ApiResponse } from '@nestjs/swagger';
import { SongService } from './song.service';

@Controller('cancion')
@ApiTags('song')
@ApiHeader({
  name: 'X-Request-id',
  description: 'Custom header for requestId generated automaticly',
})
@UseInterceptors(CacheInterceptor)
export class SongController {
  private readonly logger = new Logger(SongController.name);

  constructor(private readonly songService: SongService) {}

  @ApiResponse({
    status: 200,
    description: 'A get for a song by Id successfully fetched',
    // type: registerAuth,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @Get(':id')
  async findSongById(@Param('id') id: string) {
    this.logger.log(
      `${SongController.name} - findRecordCompanyById for id ${id}`,
    );
    return await this.songService.findSongById(id);
  }
}
