import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CreateMessageDto,
  MESSAGES_PATTERNS,
  TINDER_SERVICE,
} from '@app/contracts';
import { sendRpc } from '../rpc/rpc-call';

@Injectable()
export class MessagesGatewayService {
  constructor(
    @Inject(TINDER_SERVICE) private readonly tinderClient: ClientProxy,
  ) {}

  async getMessages(matchId: number, userId: number) {
    return sendRpc(this.tinderClient, MESSAGES_PATTERNS.GET_BY_MATCH, {
      matchId,
      userId,
    });
  }

  async sendMessage(matchId: number, userId: number, dto: CreateMessageDto) {
    return sendRpc(this.tinderClient, MESSAGES_PATTERNS.SEND, {
      matchId,
      userId,
      dto,
    });
  }
}
