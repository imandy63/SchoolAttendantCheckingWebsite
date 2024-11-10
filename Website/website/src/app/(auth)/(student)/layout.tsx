"use client";

import MainHeader from "@/components/MainHeader";
import styles from "../../../components_style/MainHeader.module.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.webContainer}>
      <MainHeader />
      {children}
    </div>
  );
}
