import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MATCHES_SERVICE } from '@app/contracts';
import { MessagesController } from './messages/messages.controller';
import { MessagesService } from './messages/messages.service';
import { PrismaModule } from './prisma/prisma.module';

const host = process.env.MICROSERVICES_HOST ?? '127.0.0.1';

@Module({
  imports: [
    PrismaModule,
    ClientsModule.register([
      {
        name: MATCHES_SERVICE,
        transport: Transport.TCP,
        options: {
          host,
          port: Number(process.env.MATCHES_SERVICE_PORT ?? 3005),
        },
      },
    ]),
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class AppModule {}
