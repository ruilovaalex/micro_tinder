import { Injectable } from '@nestjs/common';
import { SubscriptionPlan, UpdateSubscriptionDto } from '@app/contracts';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findMine(userId: number) {
    return this.prisma.subscription.findUnique({
      where: { userId },
    });
  }

  async updateMine(userId: number, dto: UpdateSubscriptionDto) {
    return this.prisma.subscription.upsert({
      where: { userId },
      update: {
        plan: dto.plan,
        expiresAt: this.getExpiresAt(dto.plan),
      },
      create: {
        userId,
        plan: dto.plan,
        expiresAt: this.getExpiresAt(dto.plan),
      },
    });
  }

  async ensureForUser(userId: number) {
    return this.prisma.subscription.upsert({
      where: { userId },
      update: {},
      create: {
        userId,
        plan: SubscriptionPlan.FREE,
        expiresAt: null,
      },
    });
  }

  private getExpiresAt(plan: SubscriptionPlan) {
    if (plan === SubscriptionPlan.FREE) {
      return null;
    }

    const expiresAt = new Date();
    expiresAt.setDate(
      expiresAt.getDate() + (plan === SubscriptionPlan.GOLD ? 30 : 90),
    );
    return expiresAt;
  }
}
