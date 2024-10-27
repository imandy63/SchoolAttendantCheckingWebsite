"use client";
import React, { createContext, useEffect, useState, ReactNode } from "react";
import { useFCM } from "../hooks/useFCM";
import { FIREBASE_CONFIG } from "@/configs/config.firebase";
import { NotificationPayload } from "firebase/messaging";
import { registerNotificationTokenAPI } from "@/api/api.notification";

interface NotificationContextType {
  notification: NotificationPayload | null;
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
  const { messaging, getToken, onMessage } = useFCM();

  const [notification, setNotification] = useState<NotificationPayload | null>(
    null
  );

  useEffect(() => {
    const requestPermission = async () => {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        if ("serviceWorker" in navigator) {
          await navigator.serviceWorker.register("/firebase-messaging-sw.js");
          const token = await getToken(messaging, {
            vapidKey: FIREBASE_CONFIG.vapidKey,
          });
          await registerNotificationTokenAPI(token);
        }
      }
    };

    requestPermission();

    onMessage(messaging, (payload) => {
      console.log("Message received: ", payload);
      setNotification(payload.data || null);
    });

    const channel = new BroadcastChannel("sw-message");
    channel.onmessage = (event) => {
      setNotification(event.data || null);
    };

    return () => channel.close();
  }, []);

  return (
    <NotificationContext.Provider value={{ notification }}>
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
