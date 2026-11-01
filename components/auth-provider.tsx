"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  getSession,
  login as apiLogin,
  register as apiRegister,
  googleLogin as apiGoogleLogin,
  logout as apiLogout,
} from "@/lib/api";import { clearSessionCookie, setSessionCookie } from "@/lib/session-cookie";import type { LoginInput, RegisterInput, User } from "@/lib/types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (input: LoginInput) => Promise<User>;
  register: (input: RegisterInput) => Promise<User>;
  googleLogin: () => Promise<User | null>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const session = await getSession();
      setUser(session);
      if (session) setSessionCookie();
      else clearSessionCookie();
    } catch {
      setUser(null);
      clearSessionCookie();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const login = useCallback(async (input: LoginInput) => {
    const nextUser = await apiLogin(input);
    setSessionCookie();
    setUser(nextUser);
    return nextUser;
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    return apiRegister(input);
  }, []);

  const googleLogin = useCallback(async () => {
    const nextUser = await apiGoogleLogin();
    if (nextUser) {
      setSessionCookie();
      setUser(nextUser);
    }
    return nextUser;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } finally {
      clearSessionCookie();
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, googleLogin, logout, refresh }),
    [user, loading, login, register, googleLogin, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
