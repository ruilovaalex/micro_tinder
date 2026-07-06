import { Injectable } from '@nestjs/common';
import { CreateDomainUserDto, rpcError } from '@app/contracts';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createFromAuth(dto: CreateDomainUserDto) {
    return this.prisma.user.upsert({
      where: { id: dto.id },
      update: {
        email: dto.email,
        role: dto.role,
      },
      create: {
        id: dto.id,
        email: dto.email,
        role: dto.role,
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw rpcError(404, 'Usuario no encontrado', 'Not Found');
    }

    return user;
  }
}
