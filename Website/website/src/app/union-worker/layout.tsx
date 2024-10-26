"use client";
import { UseUnionWorker } from "@/hooks/useAuth";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <UseUnionWorker>{children}</UseUnionWorker>;
}
