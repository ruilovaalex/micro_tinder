import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CreateMessageDto,
  MESSAGES_PATTERNS,
  MESSAGES_SERVICE,
} from '@app/contracts';
import { UsersGatewayService } from '../users/users.service';
import { sendRpc } from '../rpc/rpc-call';

@Injectable()
export class MessagesGatewayService {
  constructor(
    @Inject(MESSAGES_SERVICE) private readonly messagesClient: ClientProxy,
    private readonly usersService: UsersGatewayService,
  ) {}

  async getMessages(matchId: number, userId: number) {
    const messages = await sendRpc(
      this.messagesClient,
      MESSAGES_PATTERNS.GET_BY_MATCH,
      {
        matchId,
        userId,
      },
    );

    return Promise.all(
      messages.map(async (message) => ({
        ...message,
        sender: await this.usersService.findOne(message.senderId),
      })),
    );
  }

  async sendMessage(matchId: number, userId: number, dto: CreateMessageDto) {
    const message = await sendRpc(this.messagesClient, MESSAGES_PATTERNS.SEND, {
      matchId,
      userId,
      dto,
    });

    return {
      ...message,
      sender: await this.usersService.findOne(message.senderId),
    };
  }
}
