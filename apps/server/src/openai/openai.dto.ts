import { IsEnum, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { ConversationMessageRole } from 'src/chats/chats.dto';

export class ChatCompletionDto {
  @IsInt()
  chatConversationId: number;

  @IsNotEmpty()
  message: string;

  @IsOptional()
  model: string;
  @IsOptional()
  temperature: number;
  @IsOptional()
  max_tokens: number;
}

export class ChatCompletionMessageDto {
  @IsEnum(ConversationMessageRole)
  role: ConversationMessageRole;
  content: string;
}

export class QueryFianceInfoDto {
  startDate: string;
  endDate: string;
}
