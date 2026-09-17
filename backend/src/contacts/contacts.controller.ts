import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { JwtGuard } from '../auth/jwt.guard';
import { AuthenticatedUser } from '../auth/jwt.strategy';
import { ContactUserDto } from './dto/contact.dto';
import { ContactsService } from './contacts.service';

interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

@Controller('contacts')
@UseGuards(JwtGuard)
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post('request')
  request(@Req() req: AuthenticatedRequest, @Body() dto: ContactUserDto) {
    return this.contactsService.request(req.user.userId, dto.userId);
  }

  @Post('accept')
  accept(@Req() req: AuthenticatedRequest, @Body() dto: ContactUserDto) {
    return this.contactsService.accept(req.user.userId, dto.userId);
  }

  @Get(':userId')
  status(@Req() req: AuthenticatedRequest, @Param('userId') otherId: string) {
    return this.contactsService.status(req.user.userId, otherId);
  }
}
