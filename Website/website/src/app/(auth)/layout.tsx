"use client";
import { UseAuth } from "@/hooks/useAuth";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <UseAuth>{children}</UseAuth>;
}
