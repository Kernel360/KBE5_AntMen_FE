import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type UserRole = 'CUSTOMER' | 'MANAGER' | 'ADMIN';

interface User {
  userId: number | null;
  userName: string | null;
  userRole: UserRole | null;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User;
  token: string | null;
}

interface AuthActions {
  login: (user: User, token: string) => void;
  logout: () => void;
  setToken: (token: string | null) => void;
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: {
    userId: null,
    userName: null,
    userRole: null,
  },
  token: null,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    immer((set) => ({
      ...initialState,
      login: (user, token) => {
        set((state) => {
          state.isLoggedIn = true;
          state.user = user;
          state.token = token;
        });
      },
      logout: () => {
        set((state) => {
          Object.assign(state, initialState);
        });
      },
      setToken: (token) => {
        set((state) => {
          state.token = token;
        });
      },
    })),
    {
      name: 'auth-storage', // storage-key
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
