import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  InteractionBetweenPayload,
  INTERACTIONS_PATTERNS,
  INTERACTIONS_SERVICE,
  InteractionType,
  rpcError,
} from '@app/contracts';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MatchesService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(INTERACTIONS_SERVICE)
    private readonly interactionsClient: ClientProxy,
  ) {}

  async findMine(userId: number) {
    return this.prisma.match.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const match = await this.prisma.match.findUnique({
      where: { id },
    });

    if (!match) {
      throw rpcError(404, 'Match no encontrado', 'Not Found');
    }

    return match;
  }

  async tryCreate(fromUserId: number, toUserId: number, type: InteractionType) {
    if (type !== InteractionType.LIKE && type !== InteractionType.SUPERLIKE) {
      return null;
    }

    const payload: InteractionBetweenPayload = {
      fromUserId: toUserId,
      toUserId: fromUserId,
    };

    const reciprocal = await firstValueFrom(
      this.interactionsClient.send(INTERACTIONS_PATTERNS.FIND_BETWEEN, payload),
    );

    if (
      !reciprocal ||
      (reciprocal.type !== InteractionType.LIKE &&
        reciprocal.type !== InteractionType.SUPERLIKE)
    ) {
      return null;
    }

    const [user1Id, user2Id] = [fromUserId, toUserId].sort((a, b) => a - b);

    return this.prisma.match.upsert({
      where: {
        user1Id_user2Id: {
          user1Id,
          user2Id,
        },
      },
      update: {},
      create: {
        user1Id,
        user2Id,
      },
    });
  }
}
