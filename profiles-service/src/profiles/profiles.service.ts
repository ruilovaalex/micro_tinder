import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto, UpdateProfileDto } from '@app/contracts';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async findMine(userId: number) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Perfil no encontrado');
    }

    return profile;
  }

  async findByUserId(userId: number) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException('Perfil no encontrado');
    }

    return profile;
  }

  async createOrReplace(userId: number, dto: CreateProfileDto) {
    return this.prisma.profile.upsert({
      where: { userId },
      update: dto,
      create: {
        userId,
        name: dto.name,
        age: dto.age,
        bio: dto.bio,
        gender: dto.gender,
        photos: dto.photos ?? [],
        location: dto.location,
      },
    });
  }

  async update(userId: number, dto: UpdateProfileDto) {
    await this.findMine(userId);

    return this.prisma.profile.update({
      where: { userId },
      data: dto,
    });
  }
}
