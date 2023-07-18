import useSWR from 'swr';
import { ConversationDto } from '../types/dto';

export default function useConversationList() {
  return useSWR<ConversationDto[]>('/chats/query-conversation');
}
