import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaService) {}

  async request(requesterId: string, userId: string) {
    if (requesterId === userId) {
      throw new BadRequestException('不能和自己交换联系方式');
    }
    return this.prisma.contactExchange.upsert({
      where: { requesterId_responderId: { requesterId, responderId: userId } },
      create: { requesterId, responderId: userId, status: 'PENDING' },
      update: { status: 'PENDING' },
    });
  }

  async accept(responderId: string, userId: string) {
    const exchange = await this.prisma.contactExchange.findUnique({
      where: { requesterId_responderId: { requesterId: userId, responderId } },
    });
    if (!exchange) {
      throw new NotFoundException('没有收到对方的交换请求');
    }
    return this.prisma.contactExchange.update({
      where: { id: exchange.id },
      data: { status: 'ACCEPTED' },
    });
  }

  async status(userId: string, otherId: string) {
    const exchange = await this.prisma.contactExchange.findFirst({
      where: {
        OR: [
          { requesterId: userId, responderId: otherId },
          { requesterId: otherId, responderId: userId },
        ],
      },
    });
    if (!exchange) {
      return { status: 'NONE' };
    }
    if (exchange.status !== 'ACCEPTED') {
      return { status: exchange.status, requestedByMe: exchange.requesterId === userId };
    }
    const other = await this.prisma.user.findUnique({ where: { id: otherId } });
    return { status: 'ACCEPTED', otherPhone: other?.phone ?? null };
  }
}
