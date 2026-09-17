import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async send(senderId: string, dto: SendMessageDto) {
    if (dto.receiverId === senderId) {
      throw new BadRequestException('不能给自己发消息');
    }
    return this.prisma.message.create({
      data: { senderId, receiverId: dto.receiverId, content: dto.content },
    });
  }

  async conversation(userId: string, otherId: string) {
    return this.prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherId },
          { senderId: otherId, receiverId: userId },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async listConversations(userId: string) {
    const messages = await this.prisma.message.findMany({
      where: { OR: [{ senderId: userId }, { receiverId: userId }] },
      orderBy: { createdAt: 'desc' },
    });

    const map = new Map<string, { otherId: string; lastContent: string; lastAt: Date }>();
    for (const message of messages) {
      const otherId = message.senderId === userId ? message.receiverId : message.senderId;
      if (!map.has(otherId)) {
        map.set(otherId, { otherId, lastContent: message.content, lastAt: message.createdAt });
      }
    }
    return Array.from(map.values());
  }
}
