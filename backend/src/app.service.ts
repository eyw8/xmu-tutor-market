import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): { status: string; time: string } {
    return { status: 'ok', time: new Date().toISOString() };
  }
}
