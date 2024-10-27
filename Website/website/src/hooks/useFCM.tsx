import { FIREBASE_CONFIG } from "@/configs/config.firebase";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

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
  return { messaging, getToken, onMessage };
};
export { useFCM };
