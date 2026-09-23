"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  token: string | null;
  user: any | null;
  login: (token: string, userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedToken = localStorage.getItem("salasar_token");
    const storedUser = localStorage.getItem("salasar_user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    const publicPaths = ["/login", "/register", "/admin/login"];
    const isPublicPath = publicPaths.includes(pathname);

    // If not logged in and trying to access a protected path, redirect to login
    if (!token && !isPublicPath && !pathname.startsWith('/admin')) {
      router.push("/login");
    }
    
    // If logged in and on a public path (like login), redirect to home
    if (token && isPublicPath && pathname !== "/admin/login") {
      router.push("/");
    }
  }, [isInitialized, token, pathname, router]);

  const login = (newToken: string, userData: any) => {
    localStorage.setItem("salasar_token", newToken);
    localStorage.setItem("salasar_user", JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    router.push("/");
  };

  const logout = () => {
    localStorage.removeItem("salasar_token");
    localStorage.removeItem("salasar_user");
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  // Prevent rendering children if we are still initializing
  if (!isInitialized) {
    return <div className="min-h-screen bg-cream flex items-center justify-center">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
