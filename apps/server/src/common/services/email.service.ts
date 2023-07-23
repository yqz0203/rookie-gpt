import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {}
  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      port: this.configService.get('EMAIL_PORT') * 1,
      host: this.configService.get('EMAIL_HOST'),
      secure: true,
      auth: {
        user: this.configService.get('EMAIL_AUTH_USER'),
        pass: this.configService.get('EMAIL_AUTH_PASS'),
      },
    });

    await transporter.sendMail({
      from: this.configService.get('EMAIL_FROM'),
      to,
      subject,
      html,
    });
  }
}
