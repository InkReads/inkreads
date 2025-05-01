import { create } from 'zustand';
import { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface UserData {
  username: string;
  email: string;
  createdAt: string;
  bio?: string;
  isPrivate?: boolean;
  darkMode?: boolean;
}

interface AuthStore {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  token: string | null;
  error: string | null;
  setUser: (user: User | null) => void;
  setUserData: (userData: UserData | null) => void;
  setLoading: (loading: boolean) => void;
  setToken: (token: string | null) => void;
  setError: (error: string | null) => void;
  fetchUserData: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()((set, get) => ({
  user: null,
  userData: null,
  loading: false,
  token: null,
  error: null,
  setUser: (user) => set({ user }),
  setUserData: (userData) => set({ userData }),
  setLoading: (loading) => set({ loading }),
  setToken: (token) => set({ token }),
  setError: (error) => set({ error }),
  fetchUserData: async () => {
    const { user } = get();
    if (!user) {
      set({ userData: null });
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        set({ userData: userDoc.data() as UserData });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      set({ error: "Failed to fetch user data" });
    }
  },
}));

export default useAuthStore;