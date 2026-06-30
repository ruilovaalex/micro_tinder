import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Prisma, UserRole } from '@auth/prisma-client';
import { PrismaService } from '../prisma/prisma.service';
import {
  AuthenticatedUser,
  JwtPayload,
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
} from '@app/contracts';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: await bcrypt.hash(dto.password, 10),
          role: UserRole.USER,
        },
      });

      return this.buildAuthResponse(user.id, user.email, user.role);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('El usuario ya existe');
      }
      throw error;
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    return this.buildAuthResponse(user.id, user.email, user.role);
  }

  async refresh(dto: RefreshTokenDto) {
    const payload = await this.verifyRefreshToken(dto.refreshToken);
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        role: true,
        refreshTokenHash: true,
      },
    });

    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Refresh token invalido');
    }

    const refreshTokenMatches = await bcrypt.compare(
      dto.refreshToken,
      user.refreshTokenHash,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Refresh token invalido');
    }

    return this.buildAuthResponse(user.id, user.email, user.role);
  }

  async logout(authUser: AuthenticatedUser) {
    await this.prisma.user.update({
      where: { id: authUser.userId },
      data: { refreshTokenHash: null },
    });

    return {
      message: 'Sesion cerrada correctamente',
    };
  }

  async me(authUser: AuthenticatedUser) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: authUser.userId },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return {
      ...user,
      permissions: authUser.permissions,
    };
  }

  async validateUser(payload: JwtPayload): Promise<AuthenticatedUser> {
    if (payload.tokenType !== 'access') {
      throw new UnauthorizedException('Token de acceso invalido');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no autorizado');
    }

    const rolePermissions = await this.prisma.rolePermission.findMany({
      where: { role: user.role },
      select: {
        permission: {
          select: {
            name: true,
          },
        },
      },
    });

    return {
      userId: user.id,
      email: user.email,
      role: user.role as unknown as AuthenticatedUser['role'],
      permissions: rolePermissions
        .map(({ permission }) => permission.name)
        .sort((a, b) => a.localeCompare(b)),
    };
  }

  private async buildAuthResponse(
    userId: number,
    email: string,
    role: UserRole,
  ) {
    const permissions = await this.getPermissionsForRole(role);
    const accessToken = await this.jwtService.signAsync({
      sub: userId,
      email,
      role,
      tokenType: 'access',
    });
    const refreshToken = await this.jwtService.signAsync(
      {
        sub: userId,
        email,
        role,
        tokenType: 'refresh',
      },
      {
        expiresIn: this.getRefreshExpiresIn(),
      },
    );

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshTokenHash: await bcrypt.hash(refreshToken, 10),
      },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: userId,
        email,
        role,
        permissions,
      },
    };
  }

  private async verifyRefreshToken(refreshToken: string) {
    try {
      const payload =
        await this.jwtService.verifyAsync<JwtPayload>(refreshToken);

      if (payload.tokenType !== 'refresh') {
        throw new UnauthorizedException('Refresh token invalido');
      }

      return payload;
    } catch {
      throw new UnauthorizedException('Refresh token invalido o expirado');
    }
  }

  private async getPermissionsForRole(role: UserRole) {
    const rolePermissions = await this.prisma.rolePermission.findMany({
      where: { role },
      select: {
        permission: {
          select: {
            name: true,
          },
        },
      },
    });

    return rolePermissions
      .map(({ permission }) => permission.name)
      .sort((a, b) => a.localeCompare(b));
  }

  private getRefreshExpiresIn() {
    return (process.env.JWT_REFRESH_EXPIRES_IN ?? '7d') as never;
  }
}
