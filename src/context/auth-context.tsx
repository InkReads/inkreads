"use client"

import { useEffect, useState, createContext, useContext } from "react";
import { auth, db } from "@/lib/firebase.config";
import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser(user);
          setUsername(userData.username);
        }
      } else {
        setUser(null);
        setUsername(null);
      }
      router.push('/');
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, username, setUser, setUsername }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);