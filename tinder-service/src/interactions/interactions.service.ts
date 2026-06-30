import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateInteractionDto } from '@app/contracts';
import { PrismaService } from '../prisma/prisma.service';
import { MatchesService } from '../matches/matches.service';

@Injectable()
export class InteractionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly matchesService: MatchesService,
  ) {}

  async create(fromUserId: number, dto: CreateInteractionDto) {
    if (fromUserId === dto.toUserId) {
      throw new BadRequestException('No puedes interactuar contigo mismo');
    }

    const targetUser = await this.prisma.user.findUnique({
      where: { id: dto.toUserId },
    });

    if (!targetUser) {
      throw new NotFoundException('Usuario objetivo no encontrado');
    }

    const interaction = await this.prisma.interaction.upsert({
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

    const match = await this.matchesService.tryCreate(
      fromUserId,
      dto.toUserId,
      dto.type,
    );

    return {
      interaction,
      matchCreated: !!match,
      match,
    };
  }

  async findMine(userId: number) {
    return this.prisma.interaction.findMany({
      where: { fromUserId: userId },
      include: {
        toUser: {
          select: {
            id: true,
            email: true,
            role: true,
            profile: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
