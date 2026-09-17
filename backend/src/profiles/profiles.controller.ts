import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { JwtGuard } from '../auth/jwt.guard';
import { AuthenticatedUser } from '../auth/jwt.strategy';
import { CreateTutorProfileDto } from './dto/create-tutor-profile.dto';
import { ProfilesService } from './profiles.service';

interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

@Controller('profiles')
@UseGuards(JwtGuard)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateTutorProfileDto) {
    return this.profilesService.create(req.user.userId, dto);
  }

  @Get('me')
  getMine(@Req() req: AuthenticatedRequest) {
    return this.profilesService.getMine(req.user.userId);
  }

  @Get(':userId')
  getByUserId(@Param('userId') userId: string) {
    return this.profilesService.getByUserId(userId);
  }
}
