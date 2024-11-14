"use client";

import MainHeader from "../student/_components/Header";
import styles from "../../../components_style/MainHeader.module.css";
import { NotificationProvider } from "@/context/FCMContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.webContainer}>
      <NotificationProvider>
        <MainHeader />
        {children}
      </NotificationProvider>
    </div>
  );
}
