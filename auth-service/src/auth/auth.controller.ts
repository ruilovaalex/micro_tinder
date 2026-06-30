import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  AUTH_PATTERNS,
  AuthenticatedUser,
  JwtPayload,
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
} from '@app/contracts';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern(AUTH_PATTERNS.REGISTER)
  register(@Payload() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @MessagePattern(AUTH_PATTERNS.LOGIN)
  login(@Payload() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @MessagePattern(AUTH_PATTERNS.REFRESH)
  refresh(@Payload() dto: RefreshTokenDto) {
    return this.authService.refresh(dto);
  }

  @MessagePattern(AUTH_PATTERNS.ME)
  me(@Payload() authUser: AuthenticatedUser) {
    return this.authService.me(authUser);
  }

  @MessagePattern(AUTH_PATTERNS.LOGOUT)
  logout(@Payload() authUser: AuthenticatedUser) {
    return this.authService.logout(authUser);
  }

  @MessagePattern(AUTH_PATTERNS.VALIDATE_USER)
  validateUser(@Payload() payload: JwtPayload) {
    return this.authService.validateUser(payload);
  }
}
