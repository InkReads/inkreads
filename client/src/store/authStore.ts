import { create } from 'zustand';
import { User } from 'firebase/auth';

interface AuthStore {
  user: User | null;
  loading: boolean;
  token: string | null;
  error: string | null;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setToken: (token: string | null) => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  loading: false,
  token: null,
  error: null,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setToken: (token) => set({ token }),
  setError: (error) => set({ error }),
}));

export default useAuthStore;