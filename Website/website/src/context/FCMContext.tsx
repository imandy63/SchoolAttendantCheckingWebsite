"use client";
import React, { createContext, useEffect, useState, ReactNode } from "react";
import { useFCM, useFCMMessages } from "../hooks/useFCM";
import { FIREBASE_CONFIG } from "@/configs/config.firebase";
import { NotificationPayload } from "firebase/messaging";
import { registerNotificationTokenAPI } from "@/api/api.notification";

interface NotificationContextType {
  payload: any;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const { messaging } = useFCM();
  const { payload } = useFCMMessages({ messaging });

  return (
    <NotificationContext.Provider value={{ payload }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
