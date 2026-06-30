import { Module } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE, TINDER_SERVICE } from '@app/contracts';
import { AppController } from './app.controller';
import { AuthController } from './auth/auth.controller';
import { AuthGatewayService } from './auth/auth.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { PermissionsGuard } from './auth/permissions.guard';
import { RolesGuard } from './auth/roles.guard';
import { InteractionsController } from './interactions/interactions.controller';
import { InteractionsGatewayService } from './interactions/interactions.service';
import { MatchesController } from './matches/matches.controller';
import { MatchesGatewayService } from './matches/matches.service';
import { MessagesController } from './messages/messages.controller';
import { MessagesGatewayService } from './messages/messages.service';
import { ProfilesController } from './profiles/profiles.controller';
import { ProfilesGatewayService } from './profiles/profiles.service';
import { RpcClientsBootstrapService } from './rpc/rpc-clients.bootstrap';
import { SubscriptionsController } from './subscriptions/subscriptions.controller';
import { SubscriptionsGatewayService } from './subscriptions/subscriptions.service';
import { UsersController } from './users/users.controller';
import { UsersGatewayService } from './users/users.service';

const host = process.env.MICROSERVICES_HOST ?? '127.0.0.1';

@Module({
  imports: [
    PassportModule,
    ClientsModule.register([
      {
        name: AUTH_SERVICE,
        transport: Transport.TCP,
        options: {
          host,
          port: Number(process.env.AUTH_SERVICE_PORT ?? 3001),
        },
      },
      {
        name: TINDER_SERVICE,
        transport: Transport.TCP,
        options: {
          host,
          port: Number(process.env.TINDER_SERVICE_PORT ?? 3002),
        },
      },
    ]),
  ],
  controllers: [
    AppController,
    AuthController,
    UsersController,
    ProfilesController,
    InteractionsController,
    MatchesController,
    MessagesController,
    SubscriptionsController,
  ],
  providers: [
    AuthGatewayService,
    Reflector,
    JwtStrategy,
    PermissionsGuard,
    RolesGuard,
    UsersGatewayService,
    ProfilesGatewayService,
    InteractionsGatewayService,
    MatchesGatewayService,
    MessagesGatewayService,
    SubscriptionsGatewayService,
    RpcClientsBootstrapService,
  ],
})
export class AppModule {}
