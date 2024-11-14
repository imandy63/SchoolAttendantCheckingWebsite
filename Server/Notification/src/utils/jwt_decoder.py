from jwt import decode

def JWTDecode(JTWToken:str):
    try:
        decodedValue = decode(JTWToken,options={"verify_signature":False})
        return decodedValue["userId"]
    except:
        return None