"use client";
import { UseAdmin } from "@/hooks/useAdmin";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <UseAdmin>{children}</UseAdmin>;
}
