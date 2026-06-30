import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { AuthenticatedUser } from '@app/contracts';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Permissions } from '../auth/permissions.decorator';
import { PermissionsGuard } from '../auth/permissions.guard';
import { MatchesGatewayService } from './matches.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesGatewayService) {}

  @Permissions('match:view')
  @Get('me')
  findMine(@Request() request: ExpressRequest & { user: AuthenticatedUser }) {
    return this.matchesService.findMine(request.user.userId);
  }
}
