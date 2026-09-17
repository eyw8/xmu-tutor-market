import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { JwtGuard } from '../auth/jwt.guard';
import { AuthenticatedUser } from '../auth/jwt.strategy';
import { SendMessageDto } from './dto/send-message.dto';
import { MessagesService } from './messages.service';

interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

@Controller('messages')
@UseGuards(JwtGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  send(@Req() req: AuthenticatedRequest, @Body() dto: SendMessageDto) {
    return this.messagesService.send(req.user.userId, dto);
  }

  @Get()
  listConversations(@Req() req: AuthenticatedRequest) {
    return this.messagesService.listConversations(req.user.userId);
  }

  @Get(':userId')
  conversation(@Req() req: AuthenticatedRequest, @Param('userId') otherId: string) {
    return this.messagesService.conversation(req.user.userId, otherId);
  }
}
