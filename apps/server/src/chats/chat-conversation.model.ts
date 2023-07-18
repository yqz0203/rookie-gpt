import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../users/user.model';

@Table
export class ChatConversation extends Model {
  @Column({ defaultValue: '' })
  title: string;

  @BelongsTo(() => User, { foreignKey: 'userId', targetKey: 'id' })
  user: User;

  @Column
  latestMessageTime: Date;

  @Column({ defaultValue: 0 })
  messageCount: number;

  @ForeignKey(() => User) @Column userId!: number;

  @Column
  deletedAt: Date;
}
