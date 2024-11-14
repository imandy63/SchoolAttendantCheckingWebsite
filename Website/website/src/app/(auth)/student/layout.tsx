"use client";

import styles from "../../../components_style/MainHeader.module.css";
import { NotificationProvider } from "@/context/FCMContext";
import Navbar from "@/app/(auth)/student/_components/Navbar";
import Sidebar from "../student/_components/SidebarUser";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.webContainer}>
      <NotificationProvider>
        <Navbar/>
        <Sidebar />
        {children}
      </NotificationProvider>
    </div>
  );
}
