def ListHandler(list:list, page: int, limit: int,total: int):
    count = len(list)
    return {
        'data': list,
        'totalCount':count,
        'page':page,
        'limit':limit,
        'total':total
    }

def BooleanResponseHanlder(value: bool):
    return {
        'status': value
    }
def IntResponseHanlder(value: int):
    return {
        'total': value
    }