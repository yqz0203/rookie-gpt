import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/user.model';
import { Auth } from './auth.model';
import { AuthController } from './auth.controller';
import { EmailService } from 'src/common/services/email.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {},
    }),
    SequelizeModule.forFeature([User, Auth]),
  ],
  providers: [AuthService, JwtStrategy, EmailService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
