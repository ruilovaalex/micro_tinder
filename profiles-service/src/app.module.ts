import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ProfilesController } from './profiles/profiles.controller';
import { ProfilesService } from './profiles/profiles.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProfilesController],
  providers: [ProfilesService],
})
export class AppModule {}
