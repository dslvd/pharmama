"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch, getToken } from "./utils/client";
import { User } from "./types/users";

type AuthCtx = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<string | null>; // error msg or null
  logout: () => void;
};

const AuthContext = createContext<AuthCtx | null>(null);
export const useAuth = () => useContext(AuthContext)!;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(() => !!getToken());

  useEffect(() => {
    if (!getToken()) return;
    apiFetch<User>("/auth/me").then((r) => {
      if (r.ok) setUser(r.value);
      setLoading(false);
    });
  }, []);

  const login: AuthCtx["login"] = async (email, password) => {
    const r = await apiFetch<{ access_token: string }>("/auth/login", {
      signal: AbortSignal.timeout(60000),
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (!r.ok) return r.error;

    localStorage.setItem("token", r.value.access_token);

    const me = await apiFetch<User>("/auth/me");
    if (!me.ok) {
      localStorage.removeItem("token");
      return me.error;
    }
    setUser(me.value);
    return null;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/auth";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
