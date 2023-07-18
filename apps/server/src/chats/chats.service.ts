import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ChatConversation } from './chat-conversation.model';
import { ChatConversationMessage } from './chat-conversation-message.model';
import {
  CreateConversationDto,
  CreateConversationMessageDto,
  DeleteConversationDto,
  DeleteConversationMessageDto,
  QueryConversationListDto,
  QueryConversationMessageListDto,
  UpdateConversationConfigDto,
  UpdateConversationDto,
} from './chats.dto';
import { ChatConversationConfig } from './chat-conversation-config.model';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(ChatConversation)
    private chatConversation: typeof ChatConversation,
    @InjectModel(ChatConversationMessage)
    private chatConversationMessage: typeof ChatConversationMessage,
    @InjectModel(ChatConversationConfig)
    private chatConversationConfig: typeof ChatConversationConfig,
  ) {}

  async queryConversationList(data: QueryConversationListDto) {
    return await this.chatConversation.findAll({
      where: {
        userId: data.userId,
        deletedAt: null,
      },
      order: [['id', 'DESC']],
    });
  }

  async createConversation(data: CreateConversationDto) {
    return await this.chatConversation.create({
      title: data.title,
      userId: data.userId,
    });
  }

  async updateConversation(data: UpdateConversationDto) {
    const cc = await this.chatConversation.findOne({
      where: { id: data.id },
    });

    if (cc.userId !== data.userId) {
      throw new HttpException('无权访问', 403);
    }

    return await cc.update({
      title: data.title,
      latestMessageTime: data.latestMessageTime,
    });
  }

  async deleteConversation(data: DeleteConversationDto) {
    await this.chatConversation.update(
      {
        deletedAt: new Date(),
      },
      {
        where: {
          id: data.id,
          userId: data.userId,
        },
      },
    );
  }

  async createConversationMessage(data: CreateConversationMessageDto) {
    const chatConversation = await this.chatConversation.findOne({
      where: { id: data.chatConversationId },
    });

    if (!chatConversation) {
      throw new HttpException('会话不存在', 500);
    }

    const message = await this.chatConversationMessage.create({
      content: data.content,
      chatConversationId: data.chatConversationId,
      role: data.role,
      userId: data.userId,
    });

    await this.chatConversation.increment('messageCount', {
      where: { id: data.chatConversationId },
    });

    return message;
  }

  async queryConversationMessageList(data: QueryConversationMessageListDto) {
    return await this.chatConversationMessage.findAll({
      where: {
        chatConversationId: data.chatConversationId,
        userId: data.userId,
        deletedAt: null,
      },
      offset: data.start,
      limit: data.limit,
      order: data.sort,
    });
  }

  async deleteConversationMessage(data: DeleteConversationMessageDto) {
    const message = await this.chatConversationMessage.findOne({
      where: {
        id: data.id,
        userId: data.userId,
      },
    });

    message.deletedAt = new Date();

    await this.chatConversation.decrement('messageCount', {
      where: {
        id: message.chatConversationId,
      },
    });

    return await message.save();
  }

  async queryConversationConfig(data: {
    userId: number;
    chatConversationId: number;
  }) {
    const chatConversationConfig = await this.chatConversationConfig.findOne({
      where: {
        userId: data.userId,
        chatConversationId: data.chatConversationId,
      },
    });

    const defaultConfig = new ChatConversationConfig();

    return (chatConversationConfig || defaultConfig).toJSON();
  }

  async updateConversationConfig(data: UpdateConversationConfigDto) {
    const config = await this.chatConversationConfig.findOne({
      where: { chatConversationId: data.chatConversationId },
    });

    if (!config) {
      return await this.chatConversationConfig.create(data);
    }

    return await config.update(data);
  }
}
