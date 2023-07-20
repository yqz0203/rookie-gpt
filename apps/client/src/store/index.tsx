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

export const useAppGlobalSetting = create<{
  fullScreen: boolean;
  setFullScreen(fullScreen: boolean): void;
}>()(
  subscribeWithSelector(
    persist(
      set => ({
        fullScreen: false,
        setFullScreen(fullScreen) {
          set({ fullScreen });
        },
      }),
      {
        name: 'app-settings-store/persist',
      },
    ),
  ),
);

export const clearStore = () => {
  useAuthStore.setState({ token: '' });
};
