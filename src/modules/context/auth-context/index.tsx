"use client"

import { useEffect, useState, createContext, useContext } from "react";
import { auth } from "@/lib/firebase.config";
import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth";

interface AuthContextProps {
  user: FirebaseUser | null;
  setUser: (user: FirebaseUser | null) => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextProps>({ user: null, setUser: () => {} });

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    })
    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext);