import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE, TINDER_SERVICE } from '@app/contracts';

@Injectable()
export class RpcClientsBootstrapService implements OnApplicationBootstrap {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    @Inject(TINDER_SERVICE) private readonly tinderClient: ClientProxy,
  ) {}

  async onApplicationBootstrap() {
    await Promise.all([this.authClient.connect(), this.tinderClient.connect()]);
  }
}
