from pydantic import BaseModel

class UpdateNotificationRequest(BaseModel):
    notification_id: str
