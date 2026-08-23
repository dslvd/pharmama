import type { Viewport } from "next";
import Drawer from "@/components/SideDrawer/Drawer";

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#2D1B4E" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="antialiased bg-background text-foreground">
      <Drawer>{children}</Drawer>
    </main>
  );
}
