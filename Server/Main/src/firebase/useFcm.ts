import { getMessaging } from 'firebase/messaging';
import * as React from 'react';
import { firebaseApp } from '../firebase';
import { FCMHookParams } from '../types/common';
import useFCMMessages from './useFCMMessages';
import useFCMServiceWorker from './useFCMServiceWorker';
import useFCMToken from './useFCMToken';

export const useFCM = () => {
  const [messaging, setMessaging] = React.useState<FCMHookParams['messaging']>(null);
  const { fcmToken, notificationPermissionStatus } = useFCMToken({ messaging });
  const { payload } = useFCMMessages({
    messaging
  });
  // Trigger notification when device is offline
  const { isServiceWorkerRegistered, unregisterServiceWorker, registerServiceWorker } =
    useFCMServiceWorker({
      messaging,
      status: notificationPermissionStatus
    });

  React.useEffect(() => {
    try {
      const messaging = getMessaging(firebaseApp);
      setMessaging(messaging);
    } catch {
      setMessaging(null);
    }
  }, []);

  return {
    fcmToken,
    payload,
    notificationPermissionStatus,
    unregisterServiceWorker,
    isServiceWorkerRegistered,
    registerServiceWorker
  };
};
