"use client";

import { createContext, useState, ReactNode, useEffect } from "react";

type User = {
  id: number;
  username: string;
  email: string;
} | null;

type GlobalContextType = {
  user: User;
  setUser: (user: User) => void;
};

export const GlobalContext = createContext<GlobalContextType | null>(null);

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, []);

  return (
    <GlobalContext.Provider value={{ user, setUser }}>
      {children}
    </GlobalContext.Provider>
  );
}
