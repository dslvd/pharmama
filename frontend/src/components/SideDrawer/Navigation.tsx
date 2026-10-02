"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  PanelsTopLeft,
  ArrowLeftRight,
  Package,
  FolderBookmark,
  ClipboardList,
  LogOut,
  UserRoundCheck,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth";
import { homeFor } from "@/lib/roles";
import ExitStaffViewDialog from "@/components/ExitStaffViewDialog";

interface NavigationProps {
  isOpen: boolean;
}

const sections = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        page: "/dashboard",
        icon: PanelsTopLeft,
        roles: ["ADMIN", "OWNER"],
      },
    ],
  },
  {
    title: "Inventory",
    items: [
      { label: "Stocks", page: "/stocks", icon: Package },
      {
        label: "Products",
        page: "/products",
        icon: ClipboardList,
        roles: ["ADMIN", "OWNER"],
      },
    ],
  },
  {
    title: "Records",
    items: [
      { label: "Transactions", page: "/transaction", icon: ArrowLeftRight },
      {
        label: "Logbook",
        page: "/logbook",
        icon: FolderBookmark,
        roles: ["ADMIN", "OWNER"],
      },
    ],
  },
];

export default function Navigation({ isOpen }: NavigationProps) {
  const pathname = usePathname();
  const { user, role, staffView, logout } = useAuth();
  const [exitOpen, setExitOpen] = useState(false);

  const canSee = (roles?: string[]) =>
    !roles || (!!role && roles.includes(role));

  const visible = sections
    .map((s) => ({ ...s, items: s.items.filter((i) => canSee(i.roles)) }))
    .filter((s) => s.items.length > 0); // hide empty section headers

  return (
    <aside
      className={`sticky top-0 z-50 flex h-screen shrink-0 flex-col justify-between overflow-hidden bg-primary transition-all duration-200 ${
        isOpen ? "w-56" : "w-0"
      }`}
      aria-label="Main Navigation"
    >
      <div className="flex flex-col px-4 pt-6">
        <Link href={homeFor(role)} className="mb-10 flex items-center px-1">
          <Image
            src="/logo/pharlogo.png"
            alt="PharMaMa"
            width={160}
            height={41}
            className="shrink-0"
            priority
          />
        </Link>

        <nav className="flex flex-col gap-1">
          {visible.map((section, i) => (
            <div key={section.title} className="flex flex-col gap-1">
              <p
                className={`px-1 text-[11px] font-semibold uppercase tracking-wider text-sidebar-muted/70 ${i > 0 ? "pt-5" : ""}`}
              >
                {section.title}
              </p>
              {section.items.map(({ label, page, icon: Icon }) => {
                const isActive =
                  pathname === page || pathname.startsWith(`${page}/`);
                return (
                  <Link
                    key={page}
                    href={page}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      isActive
                        ? "bg-sidebar-active font-semibold text-primary-foreground"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-active/50 hover:text-primary-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      <div className="border-t border-sidebar-border p-4">
        {staffView && (
          <div className="mb-3 rounded-lg bg-sidebar-active/60 p-3">
            <p className="flex items-center gap-2 text-xs font-semibold text-primary-foreground">
              <UserRoundCheck className="h-4 w-4 shrink-0" />
              Pharmacist view
            </p>
            <button
              onClick={() => setExitOpen(true)}
              className="mt-2 w-full rounded-md bg-primary-foreground/10 px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/20"
            >
              Exit pharmacist view
            </button>
          </div>
        )}
        <div className="flex items-center gap-3 px-1">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sidebar-active text-sm font-bold uppercase text-primary-foreground">
            {user?.email[0]}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-primary-foreground">
              {user?.email}
            </p>
            <p className="truncate text-[11px] capitalize text-sidebar-muted/80">
              {staffView ? "staff view" : user?.role.toLowerCase()}
            </p>
          </div>
          <button
            onClick={logout}
            aria-label="Log out"
            className="text-sidebar-muted/80 transition-colors hover:text-primary-foreground"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
      <ExitStaffViewDialog open={exitOpen} onClose={() => setExitOpen(false)} />
    </aside>
  );
}
