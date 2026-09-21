"use client";

import { usePathname } from "next/navigation";
import {
  PanelsTopLeft,
  ArrowLeftRight,
  Package,
  FolderBookmark,
  ClipboardList,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth";

interface NavigationProps {
  isOpen: boolean;
  onClose: () => void;
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

export default function Navigation({ isOpen, onClose }: NavigationProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const canSee = (roles?: string[]) =>
    !roles || (!!user && roles.includes(user.role));

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
        <Link
          href="/dashboard"
          onClick={onClose}
          className="mb-10 flex items-center px-1"
        >
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
                className={`px-1 text-[11px] font-semibold uppercase tracking-wider text-violet-300/70 ${i > 0 ? "pt-5" : ""}`}
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
                    onClick={onClose}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      isActive
                        ? "bg-violet-900 font-semibold text-white"
                        : "text-violet-100/80 hover:bg-violet-900/50 hover:text-white"
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

      <div className="border-t border-violet-900/60 p-4">
        <div className="flex items-center gap-3 px-1">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-900 text-sm font-bold uppercase text-white">
            {user?.email[0]}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-white">
              {user?.email}
            </p>
            <p className="truncate text-[11px] capitalize text-violet-300/80">
              {user?.role.toLowerCase()}
            </p>
          </div>
          <button
            onClick={logout}
            aria-label="Log out"
            className="text-violet-300/80 transition-colors hover:text-white"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
