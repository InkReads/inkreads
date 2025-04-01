"use client"

import { useEffect, useState, createContext, useContext } from "react";
import { auth, db } from "@/lib/firebase.config";
import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextProps {
  user: FirebaseUser | null;
  username: string | null;
  setUser: (user: FirebaseUser | null) => void;
  setUsername: (username: string | null) => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  username: null,
  setUser: () => {},
  setUsername: () => {},
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        // Fetch the user's profile data from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUsername(userData.username);
        }

        // Redirect to novels page if on auth-related pages
        if (pathname === '/login' || pathname === '/signup') {
          router.push('/novels');
        }
      } else {
        setUser(null);
        setUsername(null);
      }
    });
    return () => unsubscribe();
  }, [pathname, router]);

  return (
    <AuthContext.Provider value={{ user, username, setUser, setUsername }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);