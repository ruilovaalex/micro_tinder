import {
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  CreateMessageDto,
  MATCHES_PATTERNS,
  MATCHES_SERVICE,
} from '@app/contracts';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(MATCHES_SERVICE) private readonly matchesClient: ClientProxy,
  ) {}

  async getMessages(matchId: number, userId: number) {
    await this.assertMatchAccess(matchId, userId);

    return this.prisma.message.findMany({
      where: { matchId },
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
    const match = await firstValueFrom(
      this.matchesClient.send(MATCHES_PATTERNS.FIND_ONE, { id: matchId }),
    );

    if (match.user1Id !== userId && match.user2Id !== userId) {
      throw new ForbiddenException('No perteneces a este chat');
    }
  }
}
