import pyaudio, wave, audioop, argparse, time, json, flask

from flask import request
from flask_cors import CORS
from threading import Thread
from rpi_ws281x import *
from ledsHelper import *
from apiHelper import *

app = flask.Flask(__name__)
CORS(app)

# TODO: Automatic threshold
# TODO: Change threshold calculation

@app.route('/getCurrentValues', methods=["POST"])
def getCurrentValues():

    global redHue, greenHue, blueHue, threshold
    
    return json.dumps({
        "red": redHue,
        "green": greenHue,
        "blue": blueHue,
        "threshold": threshold,
    }), 200

@app.route('/changePulseAction', methods=["POST"])
def changePulseAction():

    global stripMoving
    
    req = json.loads(request.data)

    if 'action' in req:

        if req['action'] == "play":
            if stripMoving:
                return getFormattedMessage("Pulse already running", 299)
            Thread(target = listen).start()
        elif req['action'] == "stop":
            stripMoving = False
            clearStrip()
        elif not stripMoving:
            return getFormattedMessage("Pulse not running", 299)
        elif req['action'] == "pause":
            stripMoving = False
        else:
            return getFormattedMessage("Unrecognized action", 400)

        return "", 204
    else:
        return getFormattedMessage("Missing attribute", 406)

@app.route('/setPulseThreshold', methods=["POST"])
def setPulseThreshold():

    global threshold
    
    req = json.loads(request.data)

    if 'threshold' in req:

        threshold = int(req['threshold'])

        return "", 204
    else:
        return getFormattedMessage("Missing attribute", 406)

@app.route('/setLedsColour', methods=["POST"])
def setLedsColour():

    global redHue, greenHue, blueHue, stripMoving

    redHue, greenHue, blueHue = getColoursFromRequest(request)

    if not stripMoving:
        changeColour(redHue, greenHue, blueHue)

    if redHue == 0 and greenHue == 0 and blueHue == 0 and stripMoving:
        stripMoving = False
        clearStrip()

    return "", 204

@app.route('/setLedsFromConfig', methods=["POST"])
def setLedsFromConfig():

    global redHue, greenHue, blueHue, stripMoving

    req = json.loads(request.data)
    if not 'colour' in req:
        return getFormattedMessage("Missing attribute", 406)

    colour = req['colour'].lower().strip()

    with open('additional.config') as json_file:
        additionalData = json.load(json_file)

        if colour in additionalData['colorConfigs']:
            redHue = additionalData['colorConfigs'][colour]['red']
            greenHue = additionalData['colorConfigs'][colour]['green']
            blueHue = additionalData['colorConfigs'][colour]['blue']

            if not stripMoving:
                changeColour(redHue, greenHue, blueHue)

    return "", 204

@app.route('/startRainbow', methods=["POST"])
def startRainbow():

    global stripMoving

    stripMoving = True

    rainbowThread = Thread(target = rainbowStrip)
    rainbowThread.start()

    return "", 204

def rainbowStrip():

    global redHue, greenHue, blueHue, strip, stripMoving

    redHue = 255
    greenHue = blueHue = 0

    print("rain started")

    while True:

        if not stripMoving:
            break

        if redHue == 255 and greenHue < 255 and blueHue == 0:
            greenHue += 5
        elif redHue > 0 and greenHue == 255:
            redHue -= 5
        elif greenHue == 255 and blueHue < 255:
            blueHue += 5
        elif greenHue > 0 and blueHue == 255:
            greenHue -= 5
        elif blueHue == 255 and redHue < 255:
            redHue += 5
        elif blueHue > 0 and redHue == 255:
            blueHue -= 5

        strip.setPixelColor(LED_COUNT-1, Color(redHue,greenHue,blueHue))    
        strip.show()
        
        for i in range(LED_COUNT - 1):
            pixelColor = strip.getPixelColorRGB(i+1)
            strip.setPixelColor(i, Color(pixelColor.r, pixelColor.g, pixelColor.b))
            strip.setPixelColor(i+1, Color(0,0,0))

        strip.show()
        time.sleep(0.001)

def moveStrip():

    # TODO: Add move direction
    global strip, stripMoving

    while True:

        if not stripMoving:
            break

        for i in range(LED_COUNT - 1):
            pixelColor = strip.getPixelColorRGB(i+1)
            strip.setPixelColor(i, Color(pixelColor.r, pixelColor.g, pixelColor.b))
            strip.setPixelColor(i+1, Color(0,0,0))

        strip.show()
        time.sleep(0.001)

def listen():

    print("Listener started")

    global strip, redHue, greenHue, blueHue, FORMAT, CHANNELS, RATE, CHUNK, LED_COUNT, stripMoving
    
    stripMoving = True

    # Make sure that the pulse will be visible
    if redHue == 0 and greenHue == 0 and blueHue == 0:
        redHue = greenHue = blueHue = 32

    pulseThread = Thread(target = moveStrip)
    pulseThread.start()

    p = pyaudio.PyAudio()
    stream = p.open(format=FORMAT,
                    channels=CHANNELS,
                    rate=RATE,
                    input=True,
                    frames_per_buffer=CHUNK)

    while True:

        if not stripMoving:
            break

        data = stream.read(CHUNK, exception_on_overflow = False)
        rms = audioop.rms(data, 2)

        currentRms = int(rms / 15)

        if(currentRms >= threshold):

            strip.setPixelColor(LED_COUNT-1, Color(redHue,greenHue,blueHue))
            strip.show()

    stream.stop_stream()
    stream.close()
    p.terminate()

    print("Listener stopped")

def maprange(a, b, s):
	(a1, a2), (b1, b2) = a, b
	return  int(b1 + ((s - a1) * (b2 - b1) / (a2 - a1)))  

app.run(port=18200, host="0.0.0.0", ssl_context=('/etc/letsencrypt/live/watzonservices.ddns.net/fullchain.pem', '/etc/letsencrypt/live/watzonservices.ddns.net/privkey.pem'))
