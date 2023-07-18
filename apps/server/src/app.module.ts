import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EmailService } from './common/services/email.service';
import { User } from './users/user.model';
import { Auth } from './auth/auth.model';
import { OpenaiModule } from './openai/openai.module';
import { ChatsModule } from './chats/chats.module';
import { ChatConversation } from './chats/chat-conversation.model';
import { ChatConversationMessage } from './chats/chat-conversation-message.model';
import { CacheModule } from '@nestjs/cache-manager';
import { ChatConversationConfig } from './chats/chat-conversation-config.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
    }),
    CacheModule.register({ isGlobal: true }),
    AuthModule,
    UsersModule,
    RedisModule.forRoot({
      config: {
        host: 'localhost',
        db: 0,
        port: 6379,
        password: process.env.REDIS_PASSWORD,
      },
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          dialect: 'mysql',
          host: configService.get('MYSQL_HOST'),
          port: Number(configService.get('MYSQL_PORT') || 3306),
          username: configService.get('MYSQL_USERNAME'),
          password: configService.get('MYSQL_PASSWORD'),
          database: configService.get('MYSQL_DATABASE'),
          define: {
            charset: 'utf8mb4',
            underscored: true,
          },
          autoLoadModels: true,
          synchronize: true,
          models: [
            User,
            Auth,
            ChatConversation,
            ChatConversationMessage,
            ChatConversationConfig,
          ],
        };
      },
    }),
    OpenaiModule,
    ChatsModule,
  ],
  controllers: [AppController],
  providers: [EmailService],
})
export class AppModule {}
