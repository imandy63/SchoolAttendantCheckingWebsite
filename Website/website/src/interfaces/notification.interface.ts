import {
  NotificationReceiveType,
  NotificationType,
} from "@/enums/notification.enum";

export interface Notification {
  _id: string;
  notification_receiver: string;
  notification_title: string;
  notification_type: NotificationType;
  notification_details: any;
}

export interface NewNotificationReceive {
  notification_receiver: string;
  notification_title: string;
  notification_type: NotificationType;
  notification_details: any;
}

export interface UpdateNotificationReceive {
  notification_type: NotificationReceiveType;
  notification_post_id: string;
}
