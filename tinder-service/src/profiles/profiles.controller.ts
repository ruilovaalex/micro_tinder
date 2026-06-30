import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CreateProfilePayload,
  PROFILES_PATTERNS,
  ProfileByUserIdPayload,
  UpdateProfilePayload,
  UserIdPayload,
} from '@app/contracts';
import { ProfilesService } from './profiles.service';

@Controller()
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @MessagePattern(PROFILES_PATTERNS.FIND_MINE)
  findMine(@Payload() payload: UserIdPayload) {
    return this.profilesService.findMine(payload.userId);
  }

  @MessagePattern(PROFILES_PATTERNS.FIND_BY_USER_ID)
  findByUserId(@Payload() payload: ProfileByUserIdPayload) {
    return this.profilesService.findByUserId(payload.userId);
  }

  @MessagePattern(PROFILES_PATTERNS.CREATE_OR_REPLACE)
  createOrReplace(@Payload() payload: CreateProfilePayload) {
    return this.profilesService.createOrReplace(payload.userId, payload.dto);
  }

  @MessagePattern(PROFILES_PATTERNS.UPDATE)
  update(@Payload() payload: UpdateProfilePayload) {
    return this.profilesService.update(payload.userId, payload.dto);
  }
}
