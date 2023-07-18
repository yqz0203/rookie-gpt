import {
  IsInt,
  IsString,
  IsEnum,
  IsNumberString,
  IsNumber,
  IsDate,
  IsDecimal,
} from 'class-validator';
import { OmitType } from '@nestjs/mapped-types';

export class CreateConversationDto {
  @IsString()
  title?: string;
  @IsInt()
  userId: number;
}

export class CreateConversationRequestDto extends OmitType(
  CreateConversationDto,
  ['userId'] as const,
) {}

export class QueryConversationListDto {
  userId: number;
}

export class QueryConversationListRequestDto extends OmitType(
  QueryConversationListDto,
  ['userId'] as const,
) {}

export class UpdateConversationDto {
  @IsInt()
  userId: number;
  @IsInt()
  id: number;
  @IsString()
  title?: string;
  @IsDate()
  latestMessageTime?: Date;
}

export class UpdateConversationRequestDto extends OmitType(
  UpdateConversationDto,
  ['userId', 'latestMessageTime'] as const,
) {}

export class DeleteConversationDto {
  @IsInt()
  id: number;
  @IsInt()
  userId: number;
}

export class DeleteConversationRequestDto extends OmitType(
  DeleteConversationDto,
  ['userId'] as const,
) {}

export enum ConversationMessageRole {
  Assistant = 'assistant',
  User = 'user',
  System = 'system',
}

export class CreateConversationMessageDto {
  @IsString()
  content: string;
  @IsInt()
  chatConversationId: number;
  @IsEnum(ConversationMessageRole)
  role: 'assistant' | 'user' | 'system';
  @IsInt()
  userId: number;
}

export class CreateConversationMessageRequestDto extends OmitType(
  CreateConversationMessageDto,
  ['userId'] as const,
) {}

export class QueryConversationMessageListDto {
  @IsInt()
  userId: number;
  @IsNumber()
  chatConversationId: number;
  start?: number;
  limit?: number;
  sort?: [string, 'DESC' | 'ASC'][];
}

export class QueryConversationMessageListRequestDto extends OmitType(
  QueryConversationMessageListDto,
  ['userId', 'chatConversationId'] as const,
) {
  @IsNumberString()
  chatConversationId: number;
}

export class DeleteConversationMessageDto {
  @IsInt()
  userId: number;
  @IsInt()
  id: number;
}

export class DeleteConversationMessageRequestDto extends OmitType(
  DeleteConversationMessageDto,
  ['userId'] as const,
) {}

export class QueryConversationConfigDto {
  @IsInt()
  userId: number;
  @IsNumberString()
  chatConversationId: number;
}

export class QueryConversationConfigRequestDto extends OmitType(
  QueryConversationConfigDto,
  ['userId'] as const,
) {}

export class UpdateConversationConfigDto {
  @IsInt()
  userId: number;
  @IsInt()
  chatConversationId: number;
  @IsString()
  model: string;
  @IsString()
  prompts: string;
  @IsNumber()
  temperature: number;
  @IsNumber()
  topP: number;
  // @IsInt()
  // n: number;
  // @Max(2)
  // @Min(0)
  // @IsInt()
  // presencePenalty: number;
}

export class UpdateConversationConfigRequestDto extends OmitType(
  UpdateConversationConfigDto,
  ['userId'] as const,
) {}
