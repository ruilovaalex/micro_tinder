import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import {
  AuthenticatedUser,
  CreateProfileDto,
  UpdateProfileDto,
} from '@app/contracts';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Permissions } from '../auth/permissions.decorator';
import { PermissionsGuard } from '../auth/permissions.guard';
import { ProfilesGatewayService } from './profiles.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesGatewayService) {}

  @Permissions('profile:view')
  @Get('me')
  findMine(@Request() request: ExpressRequest & { user: AuthenticatedUser }) {
    return this.profilesService.findMine(request.user.userId);
  }

  @Permissions('profile:view')
  @Get(':userId')
  findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.profilesService.findByUserId(userId);
  }

  @Permissions('profile:create')
  @Post()
  createOrReplace(
    @Request() request: ExpressRequest & { user: AuthenticatedUser },
    @Body() dto: CreateProfileDto,
  ) {
    return this.profilesService.createOrReplace(request.user.userId, dto);
  }

  @Permissions('profile:update')
  @Patch('me')
  update(
    @Request() request: ExpressRequest & { user: AuthenticatedUser },
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profilesService.update(request.user.userId, dto);
  }
}
