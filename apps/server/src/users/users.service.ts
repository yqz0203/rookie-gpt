import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';

// This should be a real class/interface representing a user entity

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async findOne(username: string): Promise<User | undefined> {
    return this.userModel.findOne({
      where: {
        email: username,
      },
    });
  }
}
