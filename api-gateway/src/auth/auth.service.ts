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
  TINDER_SERVICE,
  USERS_PATTERNS,
} from '@app/contracts';
import { sendRpc } from '../rpc/rpc-call';

@Injectable()
export class AuthGatewayService {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    @Inject(TINDER_SERVICE) private readonly tinderClient: ClientProxy,
  ) {}

  async register(dto: RegisterDto) {
    const authResponse = await sendRpc(this.authClient, AUTH_PATTERNS.REGISTER, dto);

    const createDomainUserDto: CreateDomainUserDto = {
      id: authResponse.user.id,
      email: authResponse.user.email,
      role: authResponse.user.role,
    };

    await sendRpc(
      this.tinderClient,
      USERS_PATTERNS.CREATE_FROM_AUTH,
      createDomainUserDto,
    );

    await sendRpc(this.tinderClient, SUBSCRIPTIONS_PATTERNS.ENSURE_FOR_USER, {
        userId: authResponse.user.id,
      });

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
      sendRpc(this.tinderClient, USERS_PATTERNS.FIND_ONE, {
        id: authUser.userId,
      }),
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
