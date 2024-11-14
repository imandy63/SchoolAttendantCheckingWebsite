from datetime import datetime, timedelta
from bson import ObjectId
class Token:
    userId: str
    token: str
    expiredAt: datetime

    def __init__(self, token,userId):
        self.token = token
        self.userId = userId
        self.expiredAt = datetime.utcnow() + timedelta(hours=1)

    def to_dict(self):
        return {
            'userId': ObjectId(self.userId),
            'token': self.token,
            'expiredAt': self.expiredAt.isoformat()
        }