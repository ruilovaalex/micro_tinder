import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  AUTH_PATTERNS,
  AUTH_SERVICE,
  AuthenticatedUser,
  CreateDomainUserDto,
  JwtPayload,
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
  SUBSCRIPTIONS_PATTERNS,
  SUBSCRIPTIONS_SERVICE,
  USERS_PATTERNS,
  USERS_SERVICE,
} from '@app/contracts';
import { sendRpc } from '../rpc/rpc-call';
import { UsersGatewayService } from '../users/users.service';

@Injectable()
export class AuthGatewayService {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    @Inject(USERS_SERVICE) private readonly usersClient: ClientProxy,
    @Inject(SUBSCRIPTIONS_SERVICE)
    private readonly subscriptionsClient: ClientProxy,
    private readonly usersService: UsersGatewayService,
  ) {}

  async register(dto: RegisterDto) {
    const authResponse = await sendRpc(this.authClient, AUTH_PATTERNS.REGISTER, dto);

    const createDomainUserDto: CreateDomainUserDto = {
      id: authResponse.user.id,
      email: authResponse.user.email,
      role: authResponse.user.role,
    };

    await sendRpc(
      this.usersClient,
      USERS_PATTERNS.CREATE_FROM_AUTH,
      createDomainUserDto,
    );

    await sendRpc(
      this.subscriptionsClient,
      SUBSCRIPTIONS_PATTERNS.ENSURE_FOR_USER,
      {
        userId: authResponse.user.id,
      },
    );

    return authResponse;
  }

  async login(dto: LoginDto) {
    return sendRpc(this.authClient, AUTH_PATTERNS.LOGIN, dto);
  }

  async refresh(dto: RefreshTokenDto) {
    return sendRpc(this.authClient, AUTH_PATTERNS.REFRESH, dto);
  }

  async me(authUser: AuthenticatedUser) {
    const [authData, domainUser] = await Promise.all([
      sendRpc(this.authClient, AUTH_PATTERNS.ME, authUser),
      this.usersService.findOne(authUser.userId),
    ]);

    return {
      ...authData,
      profile: domainUser.profile,
      subscription: domainUser.subscription,
      permissions: authUser.permissions,
    };
  }

  async logout(authUser: AuthenticatedUser) {
    return sendRpc(this.authClient, AUTH_PATTERNS.LOGOUT, authUser);
  }

  async validateUser(payload: JwtPayload) {
    return sendRpc(this.authClient, AUTH_PATTERNS.VALIDATE_USER, payload);
  }
}
