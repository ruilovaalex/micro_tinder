import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  EnsureSubscriptionDto,
  SUBSCRIPTIONS_PATTERNS,
  UpdateSubscriptionPayload,
  UserIdPayload,
} from '@app/contracts';
import { SubscriptionsService } from './subscriptions.service';

@Controller()
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @MessagePattern(SUBSCRIPTIONS_PATTERNS.FIND_MINE)
  findMine(@Payload() payload: UserIdPayload) {
    return this.subscriptionsService.findMine(payload.userId);
  }

  @MessagePattern(SUBSCRIPTIONS_PATTERNS.UPDATE_MINE)
  updateMine(@Payload() payload: UpdateSubscriptionPayload) {
    return this.subscriptionsService.updateMine(payload.userId, payload.dto);
  }

  @MessagePattern(SUBSCRIPTIONS_PATTERNS.ENSURE_FOR_USER)
  ensureForUser(@Payload() payload: EnsureSubscriptionDto) {
    return this.subscriptionsService.ensureForUser(payload.userId);
  }
}
