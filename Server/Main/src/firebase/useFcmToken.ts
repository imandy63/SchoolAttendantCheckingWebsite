import { getToken, isSupported } from 'firebase/messaging';
import * as React from 'react';
import { envVariables } from '@/constants';
import { FCMHookParams } from '../types/common';
const useFCMToken = ({ messaging }: FCMHookParams) => {
  const [token, setToken] = React.useState('');
  const [notificationPermissionStatus, setNotificationPermissionStatus] =
    React.useState<NotificationPermission>('default');

  React.useEffect(() => {
    if (!messaging) {
      return;
    }

    const retrieveToken = async () => {
      try {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
          const isAllow = await isSupported();

          if (!isAllow) {
            setNotificationPermissionStatus('denied');
            return;
          }

          const permission = await Notification.requestPermission();
          setNotificationPermissionStatus(permission);

          if (permission === 'granted') {
            const currentToken = await getToken(messaging, {
              vapidKey: envVariables.FIREBASE_VAPID_KEY
            });
            if (currentToken) {
              setToken(currentToken);
            }
          }
        }
      } catch (error) {
        /* empty */
      }
    };

    retrieveToken();
  }, [messaging]);

  return { fcmToken: token, notificationPermissionStatus };
};

export default useFCMToken;
