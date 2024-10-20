"use client";
import { useUnionWorker } from "@/hooks/useAuth";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <useUnionWorker>{children}</useUnionWorker>;
}
