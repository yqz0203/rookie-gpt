import { Controller, HttpException, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Req() req: Request) {
    return await this.authService.login(req.body.email, req.body.code);
  }

  @Post('sendCode')
  async sendCode(@Req() req: Request) {
    if (!req.body.email) {
      throw new HttpException('邮箱地址错误', 500);
    }

    if (!(await this.authService.checkUserExists(req.body.email))) {
      throw new HttpException('邮箱地址未注册', 500);
    }

    return this.authService.sendCode(req.body.email);
  }
}
