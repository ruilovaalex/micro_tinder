import { Module } from '@nestjs/common';
import { InteractionsController } from './interactions/interactions.controller';
import { InteractionsService } from './interactions/interactions.service';
import { MatchesController } from './matches/matches.controller';
import { MatchesService } from './matches/matches.service';
import { MessagesController } from './messages/messages.controller';
import { MessagesService } from './messages/messages.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProfilesController } from './profiles/profiles.controller';
import { ProfilesService } from './profiles/profiles.service';
import { SubscriptionsController } from './subscriptions/subscriptions.controller';
import { SubscriptionsService } from './subscriptions/subscriptions.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';

@Module({
  imports: [PrismaModule],
  controllers: [
    UsersController,
    ProfilesController,
    InteractionsController,
    MatchesController,
    MessagesController,
    SubscriptionsController,
  ],
  providers: [
    UsersService,
    ProfilesService,
    InteractionsService,
    MatchesService,
    MessagesService,
    SubscriptionsService,
  ],
})
export class AppModule {}
