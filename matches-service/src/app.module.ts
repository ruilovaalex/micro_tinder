import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { INTERACTIONS_SERVICE } from '@app/contracts';
import { MatchesController } from './matches/matches.controller';
import { MatchesService } from './matches/matches.service';
import { PrismaModule } from './prisma/prisma.module';

const host = process.env.MICROSERVICES_HOST ?? '127.0.0.1';

@Module({
  imports: [
    PrismaModule,
    ClientsModule.register([
      {
        name: INTERACTIONS_SERVICE,
        transport: Transport.TCP,
        options: {
          host,
          port: Number(process.env.INTERACTIONS_SERVICE_PORT ?? 3004),
        },
      },
    ]),
  ],
  controllers: [MatchesController],
  providers: [MatchesService],
})
export class AppModule {}
