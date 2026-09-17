import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { MatchingModule } from '../matching/matching.module';
import { PrismaModule } from '../prisma/prisma.module';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';

@Module({
  imports: [PrismaModule, AuthModule, MatchingModule],
  controllers: [RequestsController],
  providers: [RequestsService],
})
export class RequestsModule {}
