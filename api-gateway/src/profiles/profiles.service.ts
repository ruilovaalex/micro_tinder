import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CreateProfileDto,
  PROFILES_PATTERNS,
  TINDER_SERVICE,
  UpdateProfileDto,
} from '@app/contracts';
import { sendRpc } from '../rpc/rpc-call';

@Injectable()
export class ProfilesGatewayService {
  constructor(
    @Inject(TINDER_SERVICE) private readonly tinderClient: ClientProxy,
  ) {}

  async findMine(userId: number) {
    return sendRpc(this.tinderClient, PROFILES_PATTERNS.FIND_MINE, { userId });
  }

  async findByUserId(userId: number) {
    return sendRpc(this.tinderClient, PROFILES_PATTERNS.FIND_BY_USER_ID, {
      userId,
    });
  }

  async createOrReplace(userId: number, dto: CreateProfileDto) {
    return sendRpc(this.tinderClient, PROFILES_PATTERNS.CREATE_OR_REPLACE, {
      userId,
      dto,
    });
  }

  async update(userId: number, dto: UpdateProfileDto) {
    return sendRpc(this.tinderClient, PROFILES_PATTERNS.UPDATE, {
      userId,
      dto,
    });
  }
}
