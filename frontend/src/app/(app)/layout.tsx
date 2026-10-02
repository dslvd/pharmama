"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { homeFor, isManager, managerOnly } from "@/lib/roles";
import Drawer from "@/components/SideDrawer/Drawer";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const atRoot = pathname === "/";
  const blocked =
    !!user &&
    !isManager(role) &&
    managerOnly.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/auth");
    else if (atRoot || blocked) router.replace(homeFor(role));
  }, [loading, user, role, atRoot, blocked, router]);

  if (loading || !user || atRoot || blocked) return null;
  return <Drawer>{children}</Drawer>;
}
