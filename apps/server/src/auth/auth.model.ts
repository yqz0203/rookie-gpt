import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Auth extends Model {
  @Column({ allowNull: false })
  email: string;

  @Column({ allowNull: false })
  accessToken: string;

  @Column({ allowNull: false })
  expireAt: Date;
}
