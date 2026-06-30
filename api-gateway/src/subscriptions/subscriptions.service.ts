import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  SUBSCRIPTIONS_PATTERNS,
  TINDER_SERVICE,
  UpdateSubscriptionDto,
} from '@app/contracts';
import { sendRpc } from '../rpc/rpc-call';

@Injectable()
export class SubscriptionsGatewayService {
  constructor(
    @Inject(TINDER_SERVICE) private readonly tinderClient: ClientProxy,
  ) {}

  async findMine(userId: number) {
    return sendRpc(this.tinderClient, SUBSCRIPTIONS_PATTERNS.FIND_MINE, {
      userId,
    });
  }

  async updateMine(userId: number, dto: UpdateSubscriptionDto) {
    return sendRpc(this.tinderClient, SUBSCRIPTIONS_PATTERNS.UPDATE_MINE, {
      userId,
      dto,
    });
  }
}
