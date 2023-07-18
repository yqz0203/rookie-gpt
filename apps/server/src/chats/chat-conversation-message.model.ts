import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../users/user.model';
import { ChatConversation } from './chat-conversation.model';

@Table
export class ChatConversationMessage extends Model {
  @BelongsTo(() => ChatConversation, {
    foreignKey: 'chatConversationId',
    targetKey: 'id',
  })
  chatConversation: ChatConversation;
  @ForeignKey(() => User) @Column chatConversationId!: number;

  @BelongsTo(() => User, { foreignKey: 'userId', targetKey: 'id' })
  user: User;

  @ForeignKey(() => User) @Column userId!: number;

  @Column({ allowNull: false, type: DataType.STRING })
  content: string;

  @Column({ allowNull: false, values: ['assistant', 'user', 'system'] })
  role: string;

  @Column
  deletedAt: Date;
}
