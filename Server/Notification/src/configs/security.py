from fastapi.security import HTTPBearer

reusable_oauth2 = HTTPBearer(
    scheme_name='Authorization'
)