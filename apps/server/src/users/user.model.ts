import { Column, Index, Model, Table } from 'sequelize-typescript';

@Table
export class User extends Model {
  @Index
  @Column({ unique: true })
  email: string;

  @Column({ defaultValue: true })
  isActive: boolean;
}
