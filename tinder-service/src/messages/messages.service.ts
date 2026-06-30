import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMessageDto } from '@app/contracts';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async getMessages(matchId: number, userId: number) {
    await this.assertMatchAccess(matchId, userId);

    return this.prisma.message.findMany({
      where: { matchId },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async sendMessage(matchId: number, userId: number, dto: CreateMessageDto) {
    await this.assertMatchAccess(matchId, userId);

    return this.prisma.message.create({
      data: {
        matchId,
        senderId: userId,
        content: dto.content,
      },
    });
  }

  private async assertMatchAccess(matchId: number, userId: number) {
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      throw new NotFoundException('Match no encontrado');
    }

    if (match.user1Id !== userId && match.user2Id !== userId) {
      throw new ForbiddenException('No perteneces a este chat');
    }
  }
}
