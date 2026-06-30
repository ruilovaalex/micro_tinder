import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { AuthenticatedUser, CreateInteractionDto } from '@app/contracts';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Permissions } from '../auth/permissions.decorator';
import { PermissionsGuard } from '../auth/permissions.guard';
import { InteractionsGatewayService } from './interactions.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('interactions')
export class InteractionsController {
  constructor(
    private readonly interactionsService: InteractionsGatewayService,
  ) {}

  @Permissions('interaction:create')
  @Post()
  create(
    @Request() request: ExpressRequest & { user: AuthenticatedUser },
    @Body() dto: CreateInteractionDto,
  ) {
    return this.interactionsService.create(request.user.userId, dto);
  }

  @Permissions('interaction:view')
  @Get('me')
  findMine(@Request() request: ExpressRequest & { user: AuthenticatedUser }) {
    return this.interactionsService.findMine(request.user.userId);
  }
}
