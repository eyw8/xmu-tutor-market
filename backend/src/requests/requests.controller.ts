import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { JwtGuard } from '../auth/jwt.guard';
import { AuthenticatedUser } from '../auth/jwt.strategy';
import { CreateRequestDto } from './dto/create-request.dto';
import { RequestsService } from './requests.service';

interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

@Controller('requests')
@UseGuards(JwtGuard)
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateRequestDto) {
    return this.requestsService.create(req.user.userId, dto);
  }

  @Get()
  listMine(@Req() req: AuthenticatedRequest) {
    return this.requestsService.listMine(req.user.userId);
  }

  @Get(':id/matches')
  getMatches(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.requestsService.getMatches(id, req.user.userId);
  }
}
