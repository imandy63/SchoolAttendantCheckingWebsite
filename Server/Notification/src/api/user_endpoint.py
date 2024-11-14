from fastapi import APIRouter, status, Header,Depends
from typing import Annotated
from src.services.token_service import TokenService
from src.schemas.user_schema import TokenRequest
from src.utils.response_handler import BooleanResponseHanlder
from src.utils.token_from_header import GetTokenFromBearerAuthorization
from src.configs.security import reusable_oauth2
from src.utils.jwt_decoder import JWTDecode

router = APIRouter(
    prefix="/api/user",
    tags=["user"]
)

@router.post("/fcm-token",status_code=status.HTTP_201_CREATED, dependencies=[Depends(reusable_oauth2)])
async def add_token(tokenRequest: TokenRequest, x_client_id: Annotated[str | None, Header()] ):
    userId = x_client_id
    TokenService.addTokenToUser(userId, tokenRequest.token)
    return BooleanResponseHanlder(True)

@router.delete("/fcm-token",status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(reusable_oauth2)])
def remove_token(token: str, Authorization: Annotated[str | None, Header()]):
    token = GetTokenFromBearerAuthorization(Authorization)
    userId = JWTDecode(token)
    TokenService.removeTokenFromUser(userId, token)