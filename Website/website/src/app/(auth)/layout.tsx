"use client";
import { NotificationProvider } from "@/context/FCMContext";
import { ToastProvider } from "@/context/ToastContext";
import { UseAuth } from "@/hooks/useAuth";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UseAuth>
      <ToastProvider>
        <NotificationProvider>{children}</NotificationProvider>
      </ToastProvider>
    </UseAuth>
  );
}
