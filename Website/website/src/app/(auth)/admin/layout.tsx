"use client";
import { UseAdmin } from "@/hooks/useAuth";
import { Sidebar } from "./_components/Sidebar";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UseAdmin>
      <div className="flex">
        <Sidebar />
        {children}
      </div>
    </UseAdmin>
  );
}
