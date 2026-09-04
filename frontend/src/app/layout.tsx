import type { Metadata, Viewport } from "next";
import "./globals.css";
import Drawer from "../components/SideDrawer/Drawer";

export const metadata: Metadata = {
  title: "Pharmama",
  description: "Pharmacy inventory and transaction management system",
  icons: {
    icon: [
      {
        url: "/logo/pharlogo.png",
        media: "(prefers-color-scheme: light)",
      },
    ],
    apple: "/apple-icon.png",
  },
};

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
    <html lang="en">
      <body className="antialiased bg-background text-foreground">
        <Drawer>{children}</Drawer>
      </body>
    </html>
  );
}
