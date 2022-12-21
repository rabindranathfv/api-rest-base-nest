import {
  Body,
  Controller,
  Logger,
  Post,
  UseGuards,
  CacheKey,
  CacheTTL,
  Get,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';

import { CreateUserDto } from './../users/dtos/create-user.dto';
import { LoginDto } from './dto/login.dto';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

import { Request, Response } from 'express';

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
  async login(@Body() loginDto: LoginDto) {
    this.logger.log('login in Auth Ctrl');
    return await this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    this.logger.log('register in Auth Ctrl');
    return await this.authService.register(createUserDto);
  }

  @Get('/refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    this.logger.log('refresh in Auth Ctrl');
    const refreshToken = await this.authService.refresh(req);
    if (!refreshToken) {
      res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'invalid token, can not refresh',
      });
    }
    return res.status(200).json({
      token: refreshToken,
    });
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('logout')
  async logout() {
    this.logger.log('logout in Auth Ctrl');
    return await this.authService.logout();
  }
}
