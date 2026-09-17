import { BadRequestException, Injectable } from '@nestjs/common';

const XMU_EMAIL_DOMAIN = 'xmu.edu.cn';

@Injectable()
export class EmailVerificationService {
  isXmuEmail(email: string): boolean {
    if (!email || typeof email !== 'string') {
      return false;
    }
    const normalized = email.trim().toLowerCase();
    const atIndex = normalized.lastIndexOf('@');
    if (atIndex <= 0 || atIndex === normalized.length - 1) {
      return false;
    }
    const domain = normalized.slice(atIndex + 1);
    return domain === XMU_EMAIL_DOMAIN || domain.endsWith('.' + XMU_EMAIL_DOMAIN);
  }

  verifyXmuEmail(email: string): void {
    if (!this.isXmuEmail(email)) {
      throw new BadRequestException('仅允许 @xmu.edu.cn 邮箱');
    }
  }
}
