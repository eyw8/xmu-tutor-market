import { Body, Controller, Post } from '@nestjs/common';

import {
  AuthService,
  LoginDto,
  RegisterParentDto,
  RegisterStudentDto,
} from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/student')
  registerStudent(@Body() dto: RegisterStudentDto): Promise<{ accessToken: string }> {
    return this.authService.registerStudent(dto);
  }

  @Post('register/parent')
  registerParent(@Body() dto: RegisterParentDto): Promise<{ accessToken: string }> {
    return this.authService.registerParent(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto): Promise<{ accessToken: string }> {
    return this.authService.login(dto);
  }
}
