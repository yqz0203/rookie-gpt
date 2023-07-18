import { Module } from '@nestjs/common';
import { OpenaiController } from './openai.controller';
import { OpenaiService } from './openai.service';
import { ConfigService } from '@nestjs/config';
import { ChatsModule } from 'src/chats/chats.module';

@Module({
  imports: [ChatsModule],
  controllers: [OpenaiController],
  providers: [OpenaiService, ConfigService],
})
export class OpenaiModule {}
