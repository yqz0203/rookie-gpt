import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      port: 465,
      host: 'smtp.exmail.qq.com',
      secure: true,
      auth: {
        user: 'yangqizhang@medlinker.com',
        pass: 'syFKuF4Lxdn9k5Lc',
      },
    });

    await transporter.sendMail({
      from: 'EasyGPT <yangqizhang@medlinker.com>',
      to,
      subject,
      html,
    });
  }
}
