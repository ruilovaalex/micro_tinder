import { Injectable } from '@nestjs/common';
import { InteractionType } from '@app/contracts';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MatchesService {
  constructor(private readonly prisma: PrismaService) {}

  async findMine(userId: number) {
    const matches = await this.prisma.match.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      include: {
        user1: {
          include: {
            profile: true,
          },
        },
        user2: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return matches.map((match) => {
      const otherUser = match.user1Id === userId ? match.user2 : match.user1;

      return {
        id: match.id,
        createdAt: match.createdAt,
        otherUser: {
          id: otherUser.id,
          email: otherUser.email,
          role: otherUser.role,
          profile: otherUser.profile,
        },
      };
    });
  }

  async tryCreate(fromUserId: number, toUserId: number, type: InteractionType) {
    if (type !== InteractionType.LIKE && type !== InteractionType.SUPERLIKE) {
      return null;
    }

    const reciprocal = await this.prisma.interaction.findUnique({
      where: {
        fromUserId_toUserId: {
          fromUserId: toUserId,
          toUserId: fromUserId,
        },
      },
    });

    if (
      !reciprocal ||
      (reciprocal.type !== 'LIKE' && reciprocal.type !== 'SUPERLIKE')
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
