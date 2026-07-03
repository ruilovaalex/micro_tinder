import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CreateInteractionPayload,
  InteractionBetweenPayload,
  INTERACTIONS_PATTERNS,
  UserIdPayload,
} from '@app/contracts';
import { InteractionsService } from './interactions.service';

@Controller()
export class InteractionsController {
  constructor(private readonly interactionsService: InteractionsService) {}

  @MessagePattern(INTERACTIONS_PATTERNS.CREATE)
  create(@Payload() payload: CreateInteractionPayload) {
    return this.interactionsService.create(payload.fromUserId, payload.dto);
  }

  @MessagePattern(INTERACTIONS_PATTERNS.FIND_MINE)
  findMine(@Payload() payload: UserIdPayload) {
    return this.interactionsService.findMine(payload.userId);
  }

  @MessagePattern(INTERACTIONS_PATTERNS.FIND_BETWEEN)
  findBetween(@Payload() payload: InteractionBetweenPayload) {
    return this.interactionsService.findBetween(
      payload.fromUserId,
      payload.toUserId,
    );
  }
}
