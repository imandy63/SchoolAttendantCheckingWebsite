from src.db.firebase import Firebase

from src.models.notification_model import NewNotificationResponse
from fastapi import BackgroundTasks
from src.utils.exception_handler import NotFoundErr
from src.repositories.notification_repo import NotificationRepo
from src.services.token_service import TokenService
from src.models.notification_model import BulkNotification

class NotificationService:
    messaging = Firebase.getInstance().getMessaging()
    notificationRepository = NotificationRepo()
    tokenService = TokenService()

    @staticmethod
    def getTotalMessage(userId:str):
        return NotificationService.notificationRepository.getTotalMessage(userId)

    @staticmethod
    def getUnreadCount(userId:str):
        return NotificationService.notificationRepository.getUnreadCount(userId)

    @staticmethod
    def getMessage(messageId: str,userId):
        message = NotificationService.notificationRepository.getMessage(messageId,userId)
        if message is not None:
            return message
        else:
            raise NotFoundErr()

    @staticmethod
    def getReceivedMessage(userId: str,page, limit):
        return NotificationService.notificationRepository.getReceivedMessages(userId,page,limit)

    @staticmethod
    def updateStatus(idMes: str, userId: str, backgroundTasks: BackgroundTasks):
        result = NotificationService.notificationRepository.updateReadStatus(idMes,userId)
        if(result is not None):
            tokens = NotificationService.tokenService.getUserTokens(userId)
            if(len(tokens) > 0):
                data=NewNotificationResponse()
                backgroundTasks.add_task(NotificationService.bulkSendNotification,tokens, data.to_dict())  
        return result
    
    @staticmethod
    def updateReadStatusAll(userId: str, backgroundTasks: BackgroundTasks):
        result = NotificationService.notificationRepository.updateAllReadStatus(userId)
        if result is not None:
            tokens = NotificationService.tokenService.getUserTokens(userId)
            if(len(tokens) > 0):
                data = NewNotificationResponse()
                backgroundTasks.add_task(NotificationService.bulkSendNotification, tokens, data.to_dict())
            return True
        return False
    
    @staticmethod
    def deleteMessage(userId: str,idList: list[str],backgroundTasks: BackgroundTasks):
        backgroundTasks.add_task(NotificationService.notificationRepository.deleteMessages,userId, idList)

    @staticmethod
    def bulkCreateMessage(message: BulkNotification):
        result = NotificationService.notificationRepository.createNotificationBatch(message)
        tokens = NotificationService.tokenService.getTokensByListUsers(message.notification_receivers)
        if(str(result["id"]) is not None):
            data = NewNotificationResponse()
            NotificationService.bulkSendNotification(tokens, data.to_dict())
        return True

    @staticmethod
    def bulkSendNotification(registrationTokens,data):
        messages = NotificationService.messaging.MulticastMessage(
            data=data,
            tokens=registrationTokens,
        )
        print(registrationTokens)
        try:
            result = NotificationService.messaging.send_each_for_multicast(messages)
            return result
        except Exception as e:
            print(e)
            return None