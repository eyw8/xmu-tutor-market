import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { MatchingService } from '../matching/matching.service';
import { TimeSlot } from '../matching/score.util';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRequestDto } from './dto/create-request.dto';

@Injectable()
export class RequestsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly matching: MatchingService,
  ) {}

  async create(userId: string, dto: CreateRequestDto) {
    return this.prisma.tutoringRequest.create({
      data: {
        parentId: userId,
        childGrade: dto.childGrade,
        subject: dto.subject,
        budgetMin: dto.budgetMin,
        budgetMax: dto.budgetMax,
        timePreference: dto.timePreference as unknown as Prisma.InputJsonValue,
        region: dto.region,
      },
    });
  }

  async listMine(userId: string) {
    return this.prisma.tutoringRequest.findMany({
      where: { parentId: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMatches(requestId: string, userId: string) {
    const request = await this.prisma.tutoringRequest.findFirst({
      where: { id: requestId, parentId: userId },
    });
    if (!request) {
      throw new NotFoundException('需求不存在');
    }

    const profiles = await this.prisma.tutorProfile.findMany();

    return profiles
      .map((profile) => {
        const result = this.matching.score(
          {
            subjects: profile.subjects,
            pricePerHour: profile.pricePerHour,
            availableTimes: profile.availableTimes as unknown as TimeSlot[],
          },
          {
            subject: request.subject,
            budgetMax: request.budgetMax,
            budgetMin: request.budgetMin,
            timePreference: request.timePreference as unknown as TimeSlot[],
            region: request.region,
          },
        );

        return {
          tutorProfileId: profile.id,
          userId: profile.userId,
          college: profile.college,
          major: profile.major,
          grade: profile.grade,
          subjects: profile.subjects,
          pricePerHour: profile.pricePerHour,
          score: result.total,
          breakdown: result.breakdown,
        };
      })
      .sort((a, b) => b.score - a.score);
  }
}
