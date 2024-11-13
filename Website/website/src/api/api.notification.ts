import { urlConfig } from "@/configs/config.url";
import axiosInstance from ".";

export const registerNotificationTokenAPI = async (fcmToken: string) => {
  return (
    await axiosInstance.post(`${urlConfig.NOTIFICATION}/api/user/fcm-token`, {
      token: fcmToken,
    })
  ).data;
};

export const deleteNotificationTokenAPI = async (fcmToken: string) => {
  return (
    await axiosInstance.delete(`${urlConfig.NOTIFICATION}/api/user/fcm-token`, {
      data: { token: fcmToken },
    })
  ).data;
};

export const getUnreadCountAPI = async () => {
  return (
    await axiosInstance.get(
      `${urlConfig.NOTIFICATION}/api/notification/unread-count`
    )
  ).data;
};

export const pullNotificationAPI = async (page: number = 1) => {
  return (
    await axiosInstance.get(
      `${urlConfig.NOTIFICATION}/api/notification?page=${page}`
    )
  ).data;
};

export const readNotification = async (id: string) => {
  return (
    await axiosInstance.put(`${urlConfig.NOTIFICATION}/api/notification/read`, {
      notification_id: id,
    })
  ).data;
};

export const readAllNotification = async () => {
  return (
    await axiosInstance.put(
      `${urlConfig.NOTIFICATION}/api/notification/read-all`
    )
  ).data;
};
