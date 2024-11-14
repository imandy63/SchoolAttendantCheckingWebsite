from typing import Literal
from pymongo.results import UpdateResult
from src.models.token_model import Token
from src.db.mongodb import db
from datetime import datetime
from datetime import datetime, timedelta
from bson import ObjectId

class TokenRepo:
    COLLECTION_NAME="User_notification_tokens"
    mongo=db[COLLECTION_NAME]
    mongo.create_index("userId")

    def getTokenByUserId(self, userId: str):
        result = self.mongo.aggregate([
            {"$match":{"userId":ObjectId(userId)}},
            {
                "$group": {
                    "_id": 1,
                    "tokens": {"$push": "$token"}
                }
            },{
                "$project": {
                 "_id":0,
                 "tokens":1 
                }
            }
        ]).to_list()

        if(len(result) == 0):
            return []
        return result[0]["tokens"]

    def geTokensByListUsers(self,userIds: list[str], page, limit):
        result = self.mongo.aggregate([
            {"$sort": {"_id": 1}},
            {
                "$skip": (page - 1) * limit
            },
            {
                "$limit": limit
            },
            {
                "$match": {"userId": {"$in": [ObjectId(id) for id in userIds]}, "expiredAt": {"$gt": datetime.utcnow().isoformat()}}
            },
            {
                "$group": {
                    "_id": 1,
                    "tokens": {"$push": "$token"}
                }
            }, {
                "$project": {
                    "_id": 0,
                    "tokens": 1
                }
            }
        ]).to_list()
        if(len(result) == 0):
            return []
        return result[0]["tokens"]
    
    def addTokenToUser(self, userId:str, token:str) -> UpdateResult | Literal[True]:
        tokenExist = self.mongo.find_one({"token": token})
        if(tokenExist is None):
            newToken = Token(token,userId)
            self.mongo.insert_one(newToken.to_dict())
        else:
            self.mongo.update_one(filter={"token":token},update=
                                            { "$set": {"userId":ObjectId(userId), "expiredAt": (datetime.utcnow() + timedelta(hours=1)).isoformat()}})
        return True
    
    def deleteExpiredTokens(self):
        self.mongo.delete_many({"expiredAt": {"$lt": datetime.utcnow().isoformat()}})

    def removeTokenFromUser(self, userId:str, token:str):
        self.mongo.find_one_and_delete({"userId":ObjectId(userId), "token":token})
    
