import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Max,
  Min,
  Model,
  Table,
  Unique,
} from 'sequelize-typescript';
import { User } from '../users/user.model';
import { ChatConversation } from './chat-conversation.model';

@Table
export class ChatConversationConfig extends Model<ChatConversationConfig> {
  @Default('gpt-3.5-turbo')
  @AllowNull(false)
  @Column(DataType.STRING)
  model: string;

  @Default('[]')
  @Column(DataType.TEXT)
  prompts: string;

  @Default(1)
  @Column(DataType.FLOAT)
  temperature: number;

  @Default(1)
  @Column(DataType.FLOAT)
  topP: number;

  @Default(1)
  @Column(DataType.FLOAT)
  n: number;

  // @Default(4000)
  // @Column
  // maxTokens: number;

  @Default(0)
  @Max(2)
  @Min(0)
  @Column(DataType.FLOAT)
  presencePenalty: number;

  @BelongsTo(() => ChatConversation, {
    foreignKey: 'chatConversationId',
    targetKey: 'id',
  })
  chatConversation: ChatConversation;
  @ForeignKey(() => User)
  @Unique
  @Column
  chatConversationId!: number;

  @BelongsTo(() => User, { foreignKey: 'userId', targetKey: 'id' })
  user: User;

  @ForeignKey(() => User) @Column userId: number;

  @Column
  deletedAt: Date;
}
