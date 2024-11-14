def NotificationFromMongo(data: dict) -> dict:
        return {
            "id": str(data["_id"]),
            "notification_receiver": str(data["notification_receiver"]),
            "notification_title": data["notification_title"],
            "notification_details": data["notification_details"],
            "notification_send_time": data["notification_send_time"],
            "notification_type": data["notification_type"],
            "notification_status": data["notification_status"],
        }