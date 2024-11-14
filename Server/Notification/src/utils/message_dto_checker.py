def MessageDtoChecker(receivedMessage: dict[str,str]):
    notification_receivers = receivedMessage.get("notification_receivers")
    notification_title = receivedMessage.get("notification_title")
    notification_details= receivedMessage.get("notification_details")
    notification_type = receivedMessage.get("notification_type")
    if(notification_receivers is None
       or notification_title is None
       or notification_details is None
       or notification_type is None
    ):
        print("message dto is not in the right format(\"notification_receivers\":list[string],\"notification_receivers\":string,\"notification_details\":string,\"notification_type\":string)")
        return False
    return True

def dictToLower(receivedMessage:dict[str,str]):
    a = {}
    for key in receivedMessage.keys():
        a.setdefault(key.lower(), receivedMessage.get(key))
    return a