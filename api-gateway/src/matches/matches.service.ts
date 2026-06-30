import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MATCHES_PATTERNS, TINDER_SERVICE } from '@app/contracts';
import { sendRpc } from '../rpc/rpc-call';

@Injectable()
export class MatchesGatewayService {
  constructor(
    @Inject(TINDER_SERVICE) private readonly tinderClient: ClientProxy,
  ) {}

  async findMine(userId: number) {
    return sendRpc(this.tinderClient, MATCHES_PATTERNS.FIND_MINE, { userId });
  }
}
