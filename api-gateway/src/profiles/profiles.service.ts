import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CreateProfileDto,
  PROFILES_PATTERNS,
  PROFILES_SERVICE,
  UpdateProfileDto,
  USERS_PATTERNS,
  USERS_SERVICE,
} from '@app/contracts';
import { sendRpc } from '../rpc/rpc-call';

@Injectable()
export class ProfilesGatewayService {
  constructor(
    @Inject(PROFILES_SERVICE) private readonly profilesClient: ClientProxy,
    @Inject(USERS_SERVICE) private readonly usersClient: ClientProxy,
  ) {}

  async findMine(userId: number) {
    return sendRpc(this.profilesClient, PROFILES_PATTERNS.FIND_MINE, { userId });
  }

  async findByUserId(userId: number) {
    const [profile, user] = await Promise.all([
      sendRpc(this.profilesClient, PROFILES_PATTERNS.FIND_BY_USER_ID, { userId }),
      sendRpc(this.usersClient, USERS_PATTERNS.FIND_ONE, { id: userId }),
    ]);

    return {
      ...profile,
      user,
    };
  }

  async createOrReplace(userId: number, dto: CreateProfileDto) {
    return sendRpc(this.profilesClient, PROFILES_PATTERNS.CREATE_OR_REPLACE, {
      userId,
      dto,
    });
  }

  async update(userId: number, dto: UpdateProfileDto) {
    return sendRpc(this.profilesClient, PROFILES_PATTERNS.UPDATE, {
      userId,
      dto,
    });
  }
}
