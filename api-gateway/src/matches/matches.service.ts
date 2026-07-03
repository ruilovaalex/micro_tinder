import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MATCHES_PATTERNS, MATCHES_SERVICE } from '@app/contracts';
import { UsersGatewayService } from '../users/users.service';
import { sendRpc } from '../rpc/rpc-call';

@Injectable()
export class MatchesGatewayService {
  constructor(
    @Inject(MATCHES_SERVICE) private readonly matchesClient: ClientProxy,
    private readonly usersService: UsersGatewayService,
  ) {}

  async findMine(userId: number) {
    const matches = await sendRpc(this.matchesClient, MATCHES_PATTERNS.FIND_MINE, {
      userId,
    });

    return Promise.all(
      matches.map(async (match) => {
        const otherUserId = match.user1Id === userId ? match.user2Id : match.user1Id;

        return {
          id: match.id,
          createdAt: match.createdAt,
          otherUser: await this.usersService.findOne(otherUserId),
        };
      }),
    );
  }
}
