import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  MATCHES_PATTERNS,
  TryCreateMatchPayload,
  UserIdPayload,
} from '@app/contracts';
import { MatchesService } from './matches.service';

@Controller()
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @MessagePattern(MATCHES_PATTERNS.FIND_MINE)
  findMine(@Payload() payload: UserIdPayload) {
    return this.matchesService.findMine(payload.userId);
  }

  @MessagePattern(MATCHES_PATTERNS.TRY_CREATE)
  tryCreate(@Payload() payload: TryCreateMatchPayload) {
    return this.matchesService.tryCreate(
      payload.fromUserId,
      payload.toUserId,
      payload.type,
    );
  }
}
