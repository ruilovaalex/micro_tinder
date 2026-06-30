import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import {
  AuthenticatedUser,
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
} from '@app/contracts';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Permissions } from './permissions.decorator';
import { PermissionsGuard } from './permissions.guard';
import { AuthGatewayService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthGatewayService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('auth:me')
  @Get('me')
  me(@Request() request: ExpressRequest & { user: AuthenticatedUser }) {
    return this.authService.me(request.user);
  }

  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions('auth:logout')
  @Post('logout')
  logout(@Request() request: ExpressRequest & { user: AuthenticatedUser }) {
    return this.authService.logout(request.user);
  }
}
