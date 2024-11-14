import requests
from src.configs.api_domain import api_domain

def verifyUser(clientId,token):
    api = api_domain.AUTH_DOMAIN + "/api/auth/authenticate"
    headers = {'x-client-id': clientId,'authorization':f'bearer {token}'}
    try:
        print("api",api)
        data=requests.get(api,verify=False,headers=headers).json()
        status=data["metadata"]["status"]
        return status
    except Exception as e:
        print(e)
        return False