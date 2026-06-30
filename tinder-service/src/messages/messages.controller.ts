import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  MatchMessagesPayload,
  MESSAGES_PATTERNS,
  SendMessagePayload,
} from '@app/contracts';
import { MessagesService } from './messages.service';

@Controller()
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @MessagePattern(MESSAGES_PATTERNS.GET_BY_MATCH)
  getMessages(@Payload() payload: MatchMessagesPayload) {
    return this.messagesService.getMessages(payload.matchId, payload.userId);
  }

  @MessagePattern(MESSAGES_PATTERNS.SEND)
  sendMessage(@Payload() payload: SendMessagePayload) {
    return this.messagesService.sendMessage(
      payload.matchId,
      payload.userId,
      payload.dto,
    );
  }
}
