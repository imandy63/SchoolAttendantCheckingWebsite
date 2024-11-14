def GetTokenFromBearerAuthorization(bearer: str):
    return bearer.split(" ")[1]