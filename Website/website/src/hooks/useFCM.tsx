import { FIREBASE_CONFIG } from "@/configs/config.firebase";
import { useRegisterNotificationToken } from "@/query/useNotification";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { useEffect, useMemo, useState } from "react";

const firebaseConfig = {
  apiKey: FIREBASE_CONFIG.apiKey,
  authDomain: FIREBASE_CONFIG.authDomain,
  projectId: FIREBASE_CONFIG.projectId,
  storageBucket: FIREBASE_CONFIG.storageBucket,
  messagingSenderId: FIREBASE_CONFIG.messagingSenderId,
  appId: FIREBASE_CONFIG.appId,
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

const useFCM = () => {
  return { messaging, getToken };
};
export { useFCM };

export const useFCMMessages = ({ messaging }) => {
  const { mutate: registerToken } = useRegisterNotificationToken();

  const [payload, setPayload] = useState<any>([]);

  useEffect(() => {
    if (!messaging) {
      return;
    }

    getToken(messaging, {
      vapidKey: FIREBASE_CONFIG.vapidKey,
    }).then((token) => {
      registerToken(token);
    });

    let unsubscribe: () => void = () => {};
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const messaging = getMessaging(app);
      unsubscribe = onMessage(messaging, (payload) => {
        setPayload((prevPayload) => [...prevPayload, payload]);
      });
    }

    return () => {
      unsubscribe();
    };
  }, [messaging]);

  const channel = useMemo(() => new BroadcastChannel("sw-messages"), []);

  useEffect(() => {
    channel.addEventListener("message", (event) => {
      setPayload((prevPayload) => [...prevPayload, event.data]);
    });

    return () => {
      channel.close();
    };
  }, []);

  return { payload };
};
