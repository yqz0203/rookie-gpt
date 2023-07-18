import { Module } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ChatConversation } from './chat-conversation.model';
import { ChatConversationMessage } from './chat-conversation-message.model';
import { User } from 'src/users/user.model';
import { ChatConversationConfig } from './chat-conversation-config.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      ChatConversation,
      ChatConversationMessage,
      ChatConversationConfig,
    ]),
  ],
  controllers: [ChatsController],
  providers: [ChatsService],
  exports: [ChatsService],
})
export class ChatsModule {}
