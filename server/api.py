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

    global pulseRunning
    
    req = json.loads(request.data)

    if 'action' in req:

        if req['action'] == "play":
            if pulseRunning:
                return getFormattedMessage("Pulse already running", 299)
            Thread(target = listen).start()
        elif req['action'] == "stop":
            pulseRunning = False
            clearStrip()
        elif not pulseRunning:
            return getFormattedMessage("Pulse not running", 299)
        elif req['action'] == "pause":
            pulseRunning = False
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

    global redHue, greenHue, blueHue, pulseRunning

    redHue, greenHue, blueHue = getColoursFromRequest(request)

    if not pulseRunning:
        changeColour(redHue, greenHue, blueHue)

    if redHue == 0 and greenHue == 0 and blueHue == 0 and pulseRunning:
        pulseRunning = False
        clearStrip()

    return "", 204

def pulse():

    global strip, pulseRunning

    print("Pulsing started")

    while True:

        if not pulseRunning:
            break

        for i in range(LED_COUNT - 1):
            pixelColor = strip.getPixelColorRGB(i+1)
            strip.setPixelColor(i, Color(pixelColor.r, pixelColor.g, pixelColor.b))
            strip.setPixelColor(i+1, Color(0,0,0))

        strip.show()
        time.sleep(0.001)

    print("Pulsing stopped")

def listen():

    print("Listener started")

    global strip, redHue, greenHue, blueHue, FORMAT, CHANNELS, RATE, CHUNK, LED_COUNT, pulseRunning
    
    pulseRunning = True

    # Make sure that the pulse will be visible
    if redHue == 0 and greenHue == 0 and blueHue == 0:
        redHue = greenHue = blueHue = 32

    pulseThread = Thread(target = pulse)
    pulseThread.start()

    p = pyaudio.PyAudio()
    stream = p.open(format=FORMAT,
                    channels=CHANNELS,
                    rate=RATE,
                    input=True,
                    frames_per_buffer=CHUNK)

    while True:

        if not pulseRunning:
            break

        data = stream.read(CHUNK, exception_on_overflow = False)
        rms = audioop.rms(data, 2)

        currentRms = int(rms / 15)

        if(currentRms >= threshold):

            strip.setPixelColor(LED_COUNT-1, Color(redHue,greenHue,blueHue))

    stream.stop_stream()
    stream.close()
    p.terminate()

    print("Listener stopped")

def maprange(a, b, s):
	(a1, a2), (b1, b2) = a, b
	return  int(b1 + ((s - a1) * (b2 - b1) / (a2 - a1)))  

app.run(port=18200, host="0.0.0.0", ssl_context=('/etc/letsencrypt/live/watzonservices.ddns.net/fullchain.pem', '/etc/letsencrypt/live/watzonservices.ddns.net/privkey.pem'))
