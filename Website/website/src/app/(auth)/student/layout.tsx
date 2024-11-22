"use client";

import styles from "../../../components_style/MainHeader.module.css";
import { NotificationProvider } from "@/context/FCMContext";
import Navbar from "@/components/Navbar";
import Sidebar from "../student/_components/SidebarUser";
import { StudentInfoProvider } from "@/context/StudentAuthContext";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.webContainer}>
      <NotificationProvider>
        <StudentInfoProvider>
          <Navbar />
          <Sidebar />
          {children}
        </StudentInfoProvider>
      </NotificationProvider>
    </div>
  );
}
