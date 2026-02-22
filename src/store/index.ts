import { create } from 'zustand';
import { Application, User } from '../types';
import { getMe, logout as apiLogout, setToken } from '../api/auth';

interface Store {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  currentUser: User | null;
  authLoading: boolean;
  setCurrentUser: (user: User | null) => void;
  initAuth: () => Promise<void>;
  logout: () => void;
  users: Record<string, User>;
  addUser: (user: User) => void;
  applications: Application[];
  addApplication: (application: Omit<Application, 'id' | 'status' | 'appliedDate'>) => void;
}

export const useStore = create<Store>((set, get) => ({
  isDarkMode: false,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  currentUser: null,
  authLoading: true,
  setCurrentUser: (user) => set({ currentUser: user }),
  initAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ authLoading: false });
      return;
    }
    try {
      const { user } = await getMe();
      set({ currentUser: user, authLoading: false });
    } catch {
      apiLogout();
      set({ currentUser: null, authLoading: false });
    }
  },
  logout: () => {
    apiLogout();
    set({ currentUser: null });
  },
  users: {},
  addUser: (user) => set((state) => ({ users: { ...state.users, [user.id]: user } })),
  applications: [],
  addApplication: (app) =>
    set((state) => ({
      applications: [
        ...state.applications,
        {
          ...app,
          id: `app-${Date.now()}`,
          status: 'pending' as const,
          appliedDate: new Date().toISOString().split('T')[0],
        },
      ],
    })),
}));

// Helper to set user + token after login/register
export function setAuth(user: User, token: string) {
  setToken(token);
  useStore.getState().setCurrentUser(user);
}