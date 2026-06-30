import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CreateInteractionDto,
  INTERACTIONS_PATTERNS,
  TINDER_SERVICE,
} from '@app/contracts';
import { sendRpc } from '../rpc/rpc-call';

@Injectable()
export class InteractionsGatewayService {
  constructor(
    @Inject(TINDER_SERVICE) private readonly tinderClient: ClientProxy,
  ) {}

  async create(fromUserId: number, dto: CreateInteractionDto) {
    return sendRpc(this.tinderClient, INTERACTIONS_PATTERNS.CREATE, {
      fromUserId,
      dto,
    });
  }

  async findMine(userId: number) {
    return sendRpc(this.tinderClient, INTERACTIONS_PATTERNS.FIND_MINE, {
      userId,
    });
  }
}
