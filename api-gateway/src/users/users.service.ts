import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  PROFILES_PATTERNS,
  PROFILES_SERVICE,
  SUBSCRIPTIONS_PATTERNS,
  SUBSCRIPTIONS_SERVICE,
  USERS_PATTERNS,
  USERS_SERVICE,
} from '@app/contracts';
import { sendRpc } from '../rpc/rpc-call';

@Injectable()
export class UsersGatewayService {
  constructor(
    @Inject(USERS_SERVICE) private readonly usersClient: ClientProxy,
    @Inject(PROFILES_SERVICE) private readonly profilesClient: ClientProxy,
    @Inject(SUBSCRIPTIONS_SERVICE)
    private readonly subscriptionsClient: ClientProxy,
  ) {}

  async findAll() {
    const users = await sendRpc(this.usersClient, USERS_PATTERNS.FIND_ALL, {});

    return Promise.all(
      users.map(async (user) => ({
        ...user,
        profile: await this.getOptionalProfile(user.id),
        subscription: await this.getOptionalSubscription(user.id),
      })),
    );
  }

  async findOne(id: number) {
    const user = await sendRpc(this.usersClient, USERS_PATTERNS.FIND_ONE, { id });

    return {
      ...user,
      profile: await this.getOptionalProfile(id),
      subscription: await this.getOptionalSubscription(id),
    };
  }

  private async getOptionalProfile(userId: number) {
    try {
      return await sendRpc(this.profilesClient, PROFILES_PATTERNS.FIND_BY_USER_ID, {
        userId,
      });
    } catch {
      return null;
    }
  }

  private async getOptionalSubscription(userId: number) {
    return sendRpc(this.subscriptionsClient, SUBSCRIPTIONS_PATTERNS.FIND_MINE, {
      userId,
    });
  }
}
