import { HttpException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { Auth } from './auth.model';
import { InjectModel } from '@nestjs/sequelize';
import { EmailService } from '../common/services/email.service';
import { User } from '../users/user.model';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private redisService: RedisService,
    private emailService: EmailService,
    @InjectModel(Auth)
    private authModel: typeof Auth,
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  private getJwtRedisKey(email: string) {
    return `gpt:jwt-${email}`;
  }

  private getEmailRedisKey(email: string) {
    return `gpt:email-code-${email}`;
  }

  async validateJwt(email: string): Promise<any> {
    const accessToken = await this.redisService
      .getClient()
      .get(this.getJwtRedisKey(email));

    this.logger.log(`${email} accessToken is: ${accessToken}`);

    let expired = false;

    if (!accessToken) {
      const authInfo = await this.authModel.findOne({
        where: {
          email,
        },
      });

      if (authInfo) {
        if (authInfo.expireAt < new Date()) {
          expired = true;

          await authInfo.destroy();
        } else {
          await this.redisService
            .getClient()
            .setex(
              this.getJwtRedisKey(email),
              Math.floor((authInfo.expireAt.getTime() - Date.now()) / 1000),
              accessToken,
            );
        }
      } else {
        expired = true;
      }
    }

    if (expired) {
      await this.redisService.getClient().del(this.getJwtRedisKey(email));
      throw new HttpException('登录过期', 401);
    }
  }

  async login(email: string, code: string) {
    const redisKey = this.getEmailRedisKey(email);

    const _code = await this.redisService.getClient().get(redisKey);

    this.logger.log('auth/login', code);

    if (_code !== code) {
      throw new HttpException('验证码错误', 500);
    }

    const userInfo = await this.userModel.findOne<User>({
      where: {
        email,
      },
    });

    const payload = { email, userId: userInfo.id };
    const accessToken = this.jwtService.sign(payload);

    const authInfo = await this.authModel.findOne({
      where: {
        email,
      },
    });
    await authInfo?.destroy();

    await this.authModel.create({
      email,
      accessToken,
      expireAt: Date.now() + 3600 * 24 * 30 * 1000,
    });

    await this.redisService
      .getClient()
      .setex(this.getJwtRedisKey(email), 3600 * 24 * 30, accessToken);

    await this.redisService.getClient().del(redisKey);

    return {
      accessToken,
    };
  }

  async sendCode(email: string) {
    const redisKey = this.getEmailRedisKey(email);
    const code = Math.floor(Math.random() * 1000000).toString();

    await this.redisService.getClient().setex(redisKey, 900, code);

    return this.emailService.sendEmail(
      email,
      '【Rookie GPT】登录验证码',
      `你的验证码是：${code}，15分钟后过期`,
    );
  }

  async checkUserExists(email: string) {
    return !!(await this.userModel.findOne<User>({
      where: {
        email,
      },
    }));
  }
}
