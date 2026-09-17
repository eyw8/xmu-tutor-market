import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IsEmail, IsInt, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';

export class RegisterStudentDto {
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' })
  phone!: string;

  @MinLength(6, { message: '密码至少 6 位' })
  password!: string;

  @IsString()
  college!: string;

  @IsString()
  major!: string;

  @IsInt()
  grade!: number;

  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  email?: string;
}

export class RegisterParentDto {
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' })
  phone!: string;

  @MinLength(6, { message: '密码至少 6 位' })
  password!: string;

  @IsInt()
  childGrade!: number;
}

export class LoginDto {
  @Matches(/^1[3-9]\d{9}$/, { message: '手机号格式不正确' })
  phone!: string;

  @IsString()
  password!: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async registerStudent(dto: RegisterStudentDto): Promise<{ accessToken: string }> {
    const existing = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
    if (existing) {
      throw new ConflictException('该手机号已注册');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        phone: dto.phone,
        passwordHash,
        role: 'STUDENT',
        email: dto.email,
        studentProfile: {
          create: {
            college: dto.college,
            major: dto.major,
            grade: dto.grade,
          },
        },
      },
    });

    return this.signToken(user.id, user.phone, user.role);
  }

  async registerParent(dto: RegisterParentDto): Promise<{ accessToken: string }> {
    const existing = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
    if (existing) {
      throw new ConflictException('该手机号已注册');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        phone: dto.phone,
        passwordHash,
        role: 'PARENT',
        parentProfile: {
          create: {
            childGrade: dto.childGrade,
          },
        },
      },
    });

    return this.signToken(user.id, user.phone, user.role);
  }

  async login(dto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
    if (!user) {
      throw new UnauthorizedException('账号或密码错误');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException('账号或密码错误');
    }

    return this.signToken(user.id, user.phone, user.role);
  }

  private async signToken(userId: string, phone: string, role: string): Promise<{ accessToken: string }> {
    const accessToken = await this.jwtService.signAsync({ sub: userId, phone, role });
    return { accessToken };
  }
}
