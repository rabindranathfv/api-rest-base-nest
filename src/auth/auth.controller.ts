import {
  Body,
  Controller,
  Logger,
  Post,
  UseGuards,
  CacheKey,
  Get,
  Req,
  Res,
  HttpStatus,
  UseInterceptors,
  CacheInterceptor,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiHeader,
  ApiResponse,
} from '@nestjs/swagger';

import { CreateUserDto } from './../users/dtos/create-user.dto';
import { LoginDto } from './dto/login.dto';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

import { Request, Response } from 'express';

import { LoginAuth } from './interfaces/login-auth.interface';
import { registerAuth } from './interfaces/register-auth.interface';
import { Token } from './interfaces/token-auth.interface';

@ApiTags('auth')
@ApiHeader({
  name: 'X-Request-id',
  description: 'Custom header for requestId generated automaticly',
})
@UseInterceptors(CacheInterceptor)
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @CacheKey('login')
  @ApiResponse({
    status: 200,
    description: 'Login successfully',
    type: LoginAuth,
  })
  @ApiResponse({
    status: 409,
    description:
      'this email was not found or just password is incorrect, please check it',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async login(@Body() loginDto: LoginDto) {
    this.logger.log(`${AuthController.name} - login`);
    return await this.authService.login(loginDto);
  }

  @ApiResponse({
    status: 200,
    description: 'A get for all Users successfully fetched',
    type: registerAuth,
  })
  @ApiResponse({
    status: 409,
    description: 'this email already exist or have some errors',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    this.logger.log(`${AuthController.name} - register`);
    return await this.authService.register(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('/refresh')
  @ApiResponse({
    status: 200,
    description: 'refresh token session for auth users',
    type: Token,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized, does not have a valid token o token is Expired',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  async refresh(@Req() req: Request, @Res() res: Response) {
    this.logger.log(`${AuthController.name} - refresh`);
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
  @ApiResponse({
    status: 200,
    description: 'logout for users authenticated',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized, does not have a valid token o token is Expired',
  })
  async logout() {
    this.logger.log(`${AuthController.name} - logout`);
    const logoutRes = await this.authService.logout();

    return logoutRes;
  }
}
