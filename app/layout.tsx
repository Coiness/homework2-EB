import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import { NavigationMenu } from "@/components/NavigationMenuComponents/NavigationMenu";

export const metadata: Metadata = {
  title: "Next.js App",
  description: "Next.js app with Zustand, shadcn/ui, and TailwindCSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NavigationMenu />
        {children}
      </body>
    </html>
  );
}
