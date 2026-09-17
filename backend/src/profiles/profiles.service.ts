import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateTutorProfileDto } from './dto/create-tutor-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateTutorProfileDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    if (user.role !== 'STUDENT') {
      throw new ForbiddenException('仅学生可创建家教主页');
    }

    const data = {
      college: dto.college,
      major: dto.major,
      grade: dto.grade,
      subjects: dto.subjects,
      pricePerHour: dto.pricePerHour,
      availableTimes: dto.availableTimes as unknown as Prisma.InputJsonValue,
    };

    return this.prisma.tutorProfile.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });
  }

  async getMine(userId: string) {
    const profile = await this.prisma.tutorProfile.findUnique({ where: { userId } });
    if (!profile) {
      throw new NotFoundException('尚未创建家教主页');
    }
    return profile;
  }

  async getByUserId(userId: string) {
    const profile = await this.prisma.tutorProfile.findUnique({ where: { userId } });
    if (!profile) {
      throw new NotFoundException('该家教主页不存在');
    }
    return profile;
  }
}
