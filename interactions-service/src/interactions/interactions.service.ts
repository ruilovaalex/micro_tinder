import { Injectable } from '@nestjs/common';
import { CreateInteractionDto, rpcError } from '@app/contracts';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InteractionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(fromUserId: number, dto: CreateInteractionDto) {
    if (fromUserId === dto.toUserId) {
      throw rpcError(
        400,
        'No puedes interactuar contigo mismo',
        'Bad Request',
      );
    }

    return this.prisma.interaction.upsert({
      where: {
        fromUserId_toUserId: {
          fromUserId,
          toUserId: dto.toUserId,
        },
      },
      update: {
        type: dto.type,
      },
      create: {
        fromUserId,
        toUserId: dto.toUserId,
        type: dto.type,
      },
    });
  }

  async findMine(userId: number) {
    return this.prisma.interaction.findMany({
      where: { fromUserId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBetween(fromUserId: number, toUserId: number) {
    return this.prisma.interaction.findUnique({
      where: {
        fromUserId_toUserId: {
          fromUserId,
          toUserId,
        },
      },
    });
  }
}
