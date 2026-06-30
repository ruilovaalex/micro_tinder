import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { AuthenticatedUser, CreateMessageDto } from '@app/contracts';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Permissions } from '../auth/permissions.decorator';
import { PermissionsGuard } from '../auth/permissions.guard';
import { MessagesGatewayService } from './messages.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('chat')
export class MessagesController {
  constructor(private readonly messagesService: MessagesGatewayService) {}

  @Permissions('message:view')
  @Get(':matchId/messages')
  getMessages(
    @Request() request: ExpressRequest & { user: AuthenticatedUser },
    @Param('matchId', ParseIntPipe) matchId: number,
  ) {
    return this.messagesService.getMessages(matchId, request.user.userId);
  }

  @Permissions('message:create')
  @Post(':matchId/messages')
  sendMessage(
    @Request() request: ExpressRequest & { user: AuthenticatedUser },
    @Param('matchId', ParseIntPipe) matchId: number,
    @Body() dto: CreateMessageDto,
  ) {
    return this.messagesService.sendMessage(matchId, request.user.userId, dto);
  }
}
