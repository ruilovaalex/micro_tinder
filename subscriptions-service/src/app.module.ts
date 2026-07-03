import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { SubscriptionsController } from './subscriptions/subscriptions.controller';
import { SubscriptionsService } from './subscriptions/subscriptions.service';

@Module({
  imports: [PrismaModule],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
})
export class AppModule {}
