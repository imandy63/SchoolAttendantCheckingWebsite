from isHex import isHex

class FormatChecker:

    @staticmethod
    def FormatCheckObjectId(input: str):
        if(not isHex(input) or len(input) != 24):
            return False
        return True