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
  theme: string;
  toggleTheme: () => void;
};

export const GlobalContext = createContext<GlobalContextType | null>(null);

export function GlobalProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [theme, setTheme] = useState<string>("light");

  // Betöltéskor ellenőrizzük a mentett user-t és a mentett témát
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);

    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <GlobalContext.Provider value={{ user, setUser, theme, toggleTheme }}>
      {children}
    </GlobalContext.Provider>
  );
}