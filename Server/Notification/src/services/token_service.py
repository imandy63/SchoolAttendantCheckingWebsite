from src.repositories.token_repo import TokenRepo

class TokenService:
    tokenRepo = TokenRepo()

    @staticmethod
    def getUserTokens(userId:str):
        return TokenService.tokenRepo.getTokenByUserId(userId)
    
    @staticmethod
    def addTokenToUser(userId:str, token:str):
        TokenService.tokenRepo.addTokenToUser(userId,token)
    
    @staticmethod
    def removeTokenFromUser(userId:str, token:str):
        TokenService.tokenRepo.removeTokenFromUser(userId,token)

    @staticmethod
    def getTokensByListUsers(userIds: list[str],page=1, limit=500):
        return TokenService.tokenRepo.geTokensByListUsers(userIds,page, limit)