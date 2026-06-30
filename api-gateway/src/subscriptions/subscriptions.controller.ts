import {
  Body,
  Controller,
  Get,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { AuthenticatedUser, UpdateSubscriptionDto } from '@app/contracts';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Permissions } from '../auth/permissions.decorator';
import { PermissionsGuard } from '../auth/permissions.guard';
import { SubscriptionsGatewayService } from './subscriptions.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(
    private readonly subscriptionsService: SubscriptionsGatewayService,
  ) {}

  @Permissions('subscription:view')
  @Get('me')
  findMine(@Request() request: ExpressRequest & { user: AuthenticatedUser }) {
    return this.subscriptionsService.findMine(request.user.userId);
  }

  @Permissions('subscription:update')
  @Patch('me')
  updateMine(
    @Request() request: ExpressRequest & { user: AuthenticatedUser },
    @Body() dto: UpdateSubscriptionDto,
  ) {
    return this.subscriptionsService.updateMine(request.user.userId, dto);
  }
}
