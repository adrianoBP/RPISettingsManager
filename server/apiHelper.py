import json

def getColoursFromRequest(request):

    req = json.loads(request.data)

    red = int(req['red'] if 'red' in req else "0")
    green = int(req['green'] if 'green' in req else "0")
    blue = int(req['blue'] if 'blue' in req else "0")

    return red, green, blue

def getFormattedMessage(message, status):

    response = {
        "message": message
    }

    return json.dumps(response), status