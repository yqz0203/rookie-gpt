import { persist, subscribeWithSelector } from 'zustand/middleware';
import { create } from 'zustand';

export const useAuthStore = create<{
  token: string;
  setToken(token: string): void;
}>()(
  subscribeWithSelector(
    persist(
      set => ({
        token: '',
        setToken(token) {
          set({ token });
        },
      }),
      {
        name: 'auth-store/persist',
      },
    ),
  ),
);

interface ChatHistory {
  role?: 'user' | 'system' | 'assistant';
  message: string;
}

export const useChatHistory = create<{
  history: ChatHistory[];
  setHistory(history: ChatHistory[]): void;
}>()(
  subscribeWithSelector(
    persist(
      set => ({
        history: [] as {
          role?: 'user' | 'system' | 'assistant';
          message: string;
        }[],
        setHistory(history) {
          set({ history });
        },
      }),
      {
        name: 'history-store/persist',
      },
    ),
  ),
);

export const clearStore = () => {
  useAuthStore.setState({ token: '' });
};
