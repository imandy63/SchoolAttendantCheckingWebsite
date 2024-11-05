"use client";
import { NotificationProvider } from "@/context/FCMContext";
import { ToastProvider } from "@/context/ToastContext";
import { UseAuth } from "@/hooks/useAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UseAuth>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <NotificationProvider>{children}</NotificationProvider>
        </ToastProvider>
      </QueryClientProvider>
    </UseAuth>
  );
}
