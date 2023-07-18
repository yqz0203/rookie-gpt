export interface MessageDto {
  chatConversationId: number;
  content: string;
  createdAt: string;
  id: number | string;
  role: MessageRole;
  updatedAt: string;
  userId: 1;
}

export enum MessageRole {
  Assistant = 'assistant',
  User = 'user',
  System = 'system',
}

export interface ConversationDto {
  messageCount: number;
  updatedAt: string;
  latestMessageTime: string;
  id: number;
  title: string;
}
