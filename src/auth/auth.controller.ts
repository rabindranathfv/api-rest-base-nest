import {
  Body,
  Controller,
  Logger,
  Post,
  UseGuards,
  CacheKey,
  CacheTTL,
  Res,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';

import { CreateUserDto } from './../users/dtos/create-user.dto';
import { LoginDto } from './dto/login.dto';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

import { Response, Request } from 'express';

@ApiTags('auth')
@ApiHeader({
  name: 'X-Request-id',
  description: 'Custom header for requestId generated automaticly',
})
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @CacheKey('login')
  @CacheTTL(60)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    this.logger.log('login in Auth Ctrl');
    return await this.authService.login(loginDto, res, req);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    this.logger.log('register in Auth Ctrl');
    return await this.authService.register(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response, @Req() req: Request) {
    this.logger.log('logout in Auth Ctrl');
    return await this.authService.logout(res, req);
  }
}
