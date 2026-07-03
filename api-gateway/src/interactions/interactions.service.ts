import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CreateInteractionDto,
  INTERACTIONS_PATTERNS,
  INTERACTIONS_SERVICE,
  MATCHES_PATTERNS,
  MATCHES_SERVICE,
} from '@app/contracts';
import { UsersGatewayService } from '../users/users.service';
import { sendRpc } from '../rpc/rpc-call';

@Injectable()
export class InteractionsGatewayService {
  constructor(
    @Inject(INTERACTIONS_SERVICE)
    private readonly interactionsClient: ClientProxy,
    @Inject(MATCHES_SERVICE) private readonly matchesClient: ClientProxy,
    private readonly usersService: UsersGatewayService,
  ) {}

  async create(fromUserId: number, dto: CreateInteractionDto) {
    await this.usersService.findOne(dto.toUserId);

    const interaction = await sendRpc(
      this.interactionsClient,
      INTERACTIONS_PATTERNS.CREATE,
      {
        fromUserId,
        dto,
      },
    );

    const match = await sendRpc(this.matchesClient, MATCHES_PATTERNS.TRY_CREATE, {
      fromUserId,
      toUserId: dto.toUserId,
      type: dto.type,
    });

    return {
      interaction,
      matchCreated: !!match,
      match,
    };
  }

  async findMine(userId: number) {
    const interactions = await sendRpc(
      this.interactionsClient,
      INTERACTIONS_PATTERNS.FIND_MINE,
      { userId },
    );

    return Promise.all(
      interactions.map(async (interaction) => ({
        ...interaction,
        toUser: await this.usersService.findOne(interaction.toUserId),
      })),
    );
  }
}
