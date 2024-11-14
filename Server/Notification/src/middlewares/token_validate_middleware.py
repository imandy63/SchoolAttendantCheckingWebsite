from starlette.middleware.base import BaseHTTPMiddleware
from requests import Request
from src.auth.auth_utils import verifyUser
from fastapi.responses import JSONResponse

class TokenValiddateMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        public_paths = ["/docs", "/redoc", "/openapi.json"]

        if any(request.url.path.startswith(path) for path in public_paths):
            return await call_next(request)

        authorization: str = request.headers.get("Authorization")
        clientId: str = request.headers.get("x-client-id")
           
        if authorization is None or clientId is None:
            return JSONResponse({"error": "Token or clientId is not provided"}, 401)
        token = authorization.split(" ")[1]
        auth_response = verifyUser(clientId,token)
        if(auth_response):
            response = await call_next(request)
            return response
        else:
            return JSONResponse({"error": "Unauthorized"}, 401)