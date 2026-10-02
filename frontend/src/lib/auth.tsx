"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch, getToken } from "./utils/client";
import { Roles, User } from "./types/users";
import { isManager } from "./roles";

type AuthCtx = {
  user: User | null;
  // role the UI should use: STAFF while a manager is in pharmacist view
  role: Roles | undefined;
  loading: boolean;
  staffView: boolean;
  login: (email: string, password: string) => Promise<string | null>; // error msg or null
  logout: () => void;
  enterStaffView: () => void;
  exitStaffView: (password: string) => Promise<string | null>; // error msg or null
};

const STAFF_VIEW_KEY = "staffView";

const AuthContext = createContext<AuthCtx | null>(null);
export const useAuth = () => useContext(AuthContext)!;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(() => !!getToken());
  // kept in localStorage so a refresh doesn't drop out of pharmacist view
  // without the password. UI-only: the API still sees the manager's token.
  const [staffView, setStaffView] = useState(
    () =>
      typeof window !== "undefined" &&
      localStorage.getItem(STAFF_VIEW_KEY) === "1",
  );

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
    localStorage.removeItem(STAFF_VIEW_KEY);
    setUser(null);
    window.location.href = "/auth";
  };

  const enterStaffView = () => {
    localStorage.setItem(STAFF_VIEW_KEY, "1");
    setStaffView(true);
  };

  const exitStaffView: AuthCtx["exitStaffView"] = async (password) => {
    if (!user) return "Not signed in";
    const r = await apiFetch<{ access_token: string }>("/auth/login", {
      signal: AbortSignal.timeout(60000),
      method: "POST",
      body: JSON.stringify({ email: user.email, password }),
    });
    if (!r.ok) return r.error;

    localStorage.setItem("token", r.value.access_token);
    localStorage.removeItem(STAFF_VIEW_KEY);
    setStaffView(false);
    return null;
  };

  const inStaffView = staffView && isManager(user?.role);
  const role = inStaffView ? "STAFF" : user?.role;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        staffView: inStaffView,
        login,
        logout,
        enterStaffView,
        exitStaffView,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
