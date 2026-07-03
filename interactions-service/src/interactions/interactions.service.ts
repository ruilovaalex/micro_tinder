import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateInteractionDto } from '@app/contracts';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InteractionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(fromUserId: number, dto: CreateInteractionDto) {
    if (fromUserId === dto.toUserId) {
      throw new BadRequestException('No puedes interactuar contigo mismo');
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
