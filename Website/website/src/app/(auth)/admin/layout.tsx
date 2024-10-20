"use client";
import { UseAdmin } from "@/hooks/useAuth";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <UseAdmin>{children}</UseAdmin>;
}
