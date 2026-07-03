import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { InteractionsController } from './interactions/interactions.controller';
import { InteractionsService } from './interactions/interactions.service';

@Module({
  imports: [PrismaModule],
  controllers: [InteractionsController],
  providers: [InteractionsService],
})
export class AppModule {}
