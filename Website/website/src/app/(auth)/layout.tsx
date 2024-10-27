"use client";
import { NotificationProvider } from "@/context/FCMContext";
import { UseAuth } from "@/hooks/useAuth";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UseAuth>
      <NotificationProvider>{children}</NotificationProvider>
    </UseAuth>
  );
}
