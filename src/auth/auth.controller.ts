import {
  Body,
  Controller,
  Logger,
  Post,
  UseGuards,
  Get,
  Req,
  Res,
  HttpStatus,
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
import { NewRefreshTokenDto } from './dto/new-refresh-token.dto';
import { SkipThrottle, Throttle } from '@nestjs/throttler';

@ApiTags('auth')
@ApiHeader({
  name: 'X-Request-id',
  description: 'Custom header for requestId generated automaticly',
})
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login successfully',
    type: LoginAuth,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'this email was not found or just password is incorrect, please check it',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
  })
  @ApiResponse({
    status: HttpStatus.TOO_MANY_REQUESTS,
    description: 'to Many requests',
  })
  @Throttle(30, 60)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    this.logger.log(`${AuthController.name} - login`);
    return await this.authService.login(loginDto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'A get for all Users successfully fetched',
    type: registerAuth,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'this email already exist or have some errors',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
  })
  @ApiResponse({
    status: HttpStatus.TOO_MANY_REQUESTS,
    description: 'to Many requests',
  })
  @Throttle(20, 60)
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    this.logger.log(`${AuthController.name} - register`);
    return await this.authService.register(createUserDto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'refresh token session for auth users',
    type: Token,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized, does not have a valid token o token is Expired',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
  })
  @UseGuards(JwtAuthGuard)
  @SkipThrottle()
  @ApiBearerAuth()
  @Get('/refresh')
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

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'refresh token session for auth users',
    type: Token,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized, does not have a valid token o token is Expired',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
  })
  @ApiResponse({
    status: HttpStatus.TOO_MANY_REQUESTS,
    description: 'to Many requests',
  })
  @Throttle(10, 60)
  @Post('/refresh')
  async newRefresh(@Body() newRefreshTokenDto: NewRefreshTokenDto) {
    this.logger.log(`${AuthController.name} - newRefresh`);
    return await this.authService.newRefresh(newRefreshTokenDto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'logout for users authenticated',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized, does not have a valid token o token is Expired',
  })
  @UseGuards(JwtAuthGuard)
  @SkipThrottle()
  @ApiBearerAuth()
  @Post('logout')
  async logout() {
    this.logger.log(`${AuthController.name} - logout`);
    const logoutRes = await this.authService.logout();

    return logoutRes;
  }
}
