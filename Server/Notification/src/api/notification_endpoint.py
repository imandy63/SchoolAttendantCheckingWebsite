from fastapi import APIRouter,BackgroundTasks, Header, Depends
from typing import Annotated
from src.schemas.notification_schema import UpdateNotificationRequest
from src.utils.response_handler import ListHandler, BooleanResponseHanlder, IntResponseHanlder
from src.utils.token_from_header import GetTokenFromBearerAuthorization
from src.utils.jwt_decoder import JWTDecode
from src.configs.security import reusable_oauth2
from src.services.notification_service import NotificationService
from src.utils.mongo_schema_parser import NotificationFromMongo

router = APIRouter(
    prefix="/api/notification",
    tags=["notification"]
)

@router.get("/unread-count",dependencies=[Depends(reusable_oauth2)])
def count_unread(Authorization: Annotated[str | None, Header()]):
    token = GetTokenFromBearerAuthorization(Authorization)
    userId = JWTDecode(token)
    unreadCount = NotificationService.getUnreadCount(userId)
    return IntResponseHanlder(unreadCount)
    
@router.get("/{id}", dependencies=[Depends(reusable_oauth2)])
def get_message(id:str,Authorization: Annotated[str | None, Header()]):
    token = GetTokenFromBearerAuthorization(Authorization)
    userId = JWTDecode(token)
    return NotificationService.getMessage(id,userId)

@router.get("", dependencies=[Depends(reusable_oauth2)])
def get_messages(Authorization: Annotated[str | None, Header()],page: int=1, limit: int=10):
    token = GetTokenFromBearerAuthorization(Authorization)
    userId = JWTDecode(token)
    total = NotificationService.getTotalMessage(userId)
    messages = NotificationService.getReceivedMessage(userId,page,limit)
    lstMessage = [NotificationFromMongo(message) for message in messages]
    return ListHandler(lstMessage,page,limit,total)

@router.put("/read", dependencies=[Depends(reusable_oauth2)])
def update_read_status(request:UpdateNotificationRequest, backgroundTasks: BackgroundTasks,Authorization: Annotated[str | None, Header()]):
    token = GetTokenFromBearerAuthorization(Authorization)
    userId = JWTDecode(token)
    return NotificationFromMongo(NotificationService.updateStatus(request.notification_id,userId, backgroundTasks))

@router.put("/read-all", dependencies=[Depends(reusable_oauth2)])
def update_all_read_status(backgroundTasks: BackgroundTasks,Authorization: Annotated[str | None, Header()]):
    token = GetTokenFromBearerAuthorization(Authorization)
    userId = JWTDecode(token)
    return BooleanResponseHanlder(NotificationService.updateReadStatusAll(userId,backgroundTasks))