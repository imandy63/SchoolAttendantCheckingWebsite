from typing import Any, Dict
from fastapi import HTTPException

class ErrBody:
    message:str
    code:str

    def __init__(self, code, message, ):
        self.code = code
        self.message = message


class BadRequestErr(HTTPException):
    code=400

    def __init__(self, detail: Any = "Bad Request error", headers: Dict[str, str] | None = None) -> None:
        super().__init__(self.code, ErrBody(self.code,detail).__dict__, headers)


class UnauthorizedErr(HTTPException):
    code=401

    def __init__(self, detail: Any = "Unauthorized", headers: Dict[str, str] | None = None) -> None:
        super().__init__(self.code, ErrBody(self.code,detail).__dict__, headers)

class NotFoundErr(HTTPException):
    code=404

    def __init__(self, detail: Any = "Not Found", headers: Dict[str, str] | None = None) -> None:
        super().__init__(self.code, ErrBody(self.code,detail).__dict__, headers)
