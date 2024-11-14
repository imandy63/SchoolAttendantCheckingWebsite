
from datetime import datetime, date
from enum import Enum
from bson import ObjectId
from src.enums.notification_status import notification_status_enum
from src.enums.firebase_notification_type import firebase_notification_type_enum
from src.enums.notification_type import notification_type_enum


class NewNotification:
    notification_receiver: str
    notification_title: str
    notification_sendTime: datetime
    notification_details: str
    notification_status: notification_status_enum
    notification_type: notification_type_enum

    def __init__(self,notification_receiver:str=None, notification_title:str=None, notification_details:str=None, notification_sendTime:datetime=None, notification_type:notification_type_enum=None):
        self.notification_receiver = notification_receiver
        self.notification_title = notification_title
        self.notification_status= notification_status_enum.SENT.value
        self.notification_details = notification_details
        self.notification_sendTime = notification_sendTime
        self.notification_type = notification_type

    def to_dict(self):
        return {
            'notification_receiver': ObjectId(self.notification_receiver),
            'notification_title':self.notification_title,
            'notification_details':self.notification_details,
            'notification_status': self.notification_status,
            'notification_sendTime':self.notification_sendTime,
            'notification_type': self.notification_type,
        }
    
class BulkNotification:
    notification_receivers: list[str]
    notification_title: str
    notification_details: str
    notification_send_time: datetime
    notification_status: notification_status_enum
    notification_type: notification_type_enum

    def __init__(self, notification_receivers:list[str]=None, notification_title:str=None, notification_details:str=None, notification_send_time:datetime=None,notification_type:notification_type_enum=None):
        self.notification_receivers = notification_receivers
        self.notification_title = notification_title
        self.notification_status= notification_status_enum.SENT.value
        self.notification_details = notification_details
        self.notification_send_time = notification_send_time
        self.notification_type = notification_type

    def to_dict_list(self):
        return [{
            'notification_receiver': ObjectId(i),
            'notification_title':self.notification_title,
            'notification_details':self.notification_details,
            'notification_status': self.notification_status,
            'notification_send_time':self.notification_send_time,
            'notification_type': self.notification_type,
        } for i in self.notification_receivers]

class NewNotificationResponse():
    notificationType: firebase_notification_type_enum

    def __init__(self):
        self.notificationType = firebase_notification_type_enum.NEW_NOTIFICATION.value

    def to_dict(self):
        return {
            'notificationType': self.notificationType
        }