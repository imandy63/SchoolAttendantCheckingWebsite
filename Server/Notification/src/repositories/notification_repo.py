from src.models.notification_model import BulkNotification
from datetime import datetime
from src.db.mongodb import db
from src.utils.exception_handler import BadRequestErr
from src.enums.notification_status import notification_status_enum
from bson.objectid import ObjectId
import pymongo
from src.utils.format_checker import FormatChecker

class NotificationRepo:
    COLLECTION_NAME="Notifications"
    mongo=db[COLLECTION_NAME]
    mongo.create_index("notification_receiver")

    def getTotalMessage(self,userId):
        total = self.mongo.count_documents({"notification_receiver":ObjectId(userId), "notification_status": {"$ne": notification_status_enum.DELETED.value}})
        return total
        
    def getUnreadCount(self,userId: str):
        print(userId)
        total = self.mongo.count_documents({"notification_receiver":ObjectId(userId),"notification_status":notification_status_enum.SENT.value})
        return total

    def getMessage(self,messageId: str,userId):
        try:
            if(not FormatChecker.FormatCheckObjectId(messageId)):
                raise BadRequestErr("Message id must be in hex format and contain 24 characters")
            message = self.mongo.find_one({"_id": ObjectId(messageId), "notification_receiver":userId, "notifcation_status":{"$ne":notification_status_enum.DELETED.value}})
            return message
        except Exception as e:
            raise BadRequestErr("Error occurred when getting message")
        
    def getReceivedMessages(self, userId: str,page,limit):
        if(page>10):
            return []
        try:
            pipeLine = [
                        {"$match":{"notification_receiver":ObjectId(userId), "notifcation_status":{"$ne":notification_status_enum.DELETED.value}}},
                        {"$sort" : {"notifcation_status" : pymongo.DESCENDING, "notification_send_time" : pymongo.DESCENDING}},
                        {"$skip":(page-1)*limit},
                        {"$limit":limit}
                        ]
            result = self.mongo.aggregate(pipeLine)
            return result
        except Exception as e:
            print(e)
            raise BadRequestErr("Error occurred when receiving messages list")
        
    def createNotificationBatch(self, message: BulkNotification):
        try:
            result = self.mongo.insert_many(message.to_dict_list())
            return {'id': result.inserted_ids,'sendTime': message.notification_send_time}
        except Exception as e:
            print(e)
            raise BadRequestErr("Cannot insert message into database")
        
    def updateReadStatus(self, messageId,userId: str):
        try:
            if(not FormatChecker.FormatCheckObjectId(messageId)):
                raise BadRequestErr("Message id must be in hex format and contain 24 characters")
            update = self.mongo.find_one_and_update(filter={"_id":ObjectId(messageId), "notification_receiver":ObjectId(userId)},update={"$set":{"notification_status": notification_status_enum.READ.value}},return_document=pymongo.ReturnDocument.AFTER)
            return update
        except Exception as e:
            print(e)
            raise BadRequestErr("Error occurred when updating read status")
        
    def updateAllReadStatus(self,userId: str):
        try:
            update = self.mongo.update_many({"notification_receiver":ObjectId(userId)},{"$set":{"notification_status": notification_status_enum.READ.value}})
            if(update.modified_count > 0):
                return update
            return None
        except Exception as e:
            print(e)
            raise BadRequestErr("Error occurred when updating all read status")
    