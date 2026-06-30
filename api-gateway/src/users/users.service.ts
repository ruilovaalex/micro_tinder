import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { TINDER_SERVICE, USERS_PATTERNS } from '@app/contracts';
import { sendRpc } from '../rpc/rpc-call';

@Injectable()
export class UsersGatewayService {
  constructor(
    @Inject(TINDER_SERVICE) private readonly tinderClient: ClientProxy,
  ) {}

  async findAll() {
    return sendRpc(this.tinderClient, USERS_PATTERNS.FIND_ALL, {});
  }

  async findOne(id: number) {
    return sendRpc(this.tinderClient, USERS_PATTERNS.FIND_ONE, { id });
  }
}
