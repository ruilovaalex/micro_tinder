import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  AUTH_SERVICE,
  INTERACTIONS_SERVICE,
  MATCHES_SERVICE,
  MESSAGES_SERVICE,
  PROFILES_SERVICE,
  SUBSCRIPTIONS_SERVICE,
  USERS_SERVICE,
} from '@app/contracts';

@Injectable()
export class RpcClientsBootstrapService implements OnApplicationBootstrap {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    @Inject(USERS_SERVICE) private readonly usersClient: ClientProxy,
    @Inject(PROFILES_SERVICE) private readonly profilesClient: ClientProxy,
    @Inject(INTERACTIONS_SERVICE)
    private readonly interactionsClient: ClientProxy,
    @Inject(MATCHES_SERVICE) private readonly matchesClient: ClientProxy,
    @Inject(MESSAGES_SERVICE) private readonly messagesClient: ClientProxy,
    @Inject(SUBSCRIPTIONS_SERVICE)
    private readonly subscriptionsClient: ClientProxy,
  ) {}

  async onApplicationBootstrap() {
    await Promise.all([
      this.authClient.connect(),
      this.usersClient.connect(),
      this.profilesClient.connect(),
      this.interactionsClient.connect(),
      this.matchesClient.connect(),
      this.messagesClient.connect(),
      this.subscriptionsClient.connect(),
    ]);
  }
}
