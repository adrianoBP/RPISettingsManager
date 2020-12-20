import pyaudio, wave, audioop, argparse, time, json, flask

from flask import request
from flask_cors import CORS
from threading import Thread
from rpi_ws281x import *
from ledsHelper import *
from apiHelper import *

app = flask.Flask(__name__)
CORS(app)

@app.route('/changePulseColour', methods=["POST"])
def changePulseColour():

    global myR, myG, myB
    
    myR, myG, myB = getColoursFromRequest(request)

    return str("OK")

@app.route('/changePulseStatus', methods=["POST"])
def changePulseStatus():

    global pulseRunning
    
    req = json.loads(request.data)

    if 'running' in req:
        pulseRunning = bool(req['running'])

        if pulseRunning:
            listenerThread = Thread(target = listen)
            listenerThread.start()

        return str("OK")
    else:
        return "Missing attribute", 400

@app.route('/changePulseAction', methods=["POST"])
def changePulseAction():

    global pulseRunning
    
    req = json.loads(request.data)

    if 'action' in req:

        if req['action'] == "play":
            thread3 = Thread(target = listen)
            thread3.start()
        elif req['action'] == "pause":
            pulseRunning = False
        elif req['action'] == "stop":
            pulseRunning = False
            clearStrip()
        else:
            return "Unrecognized action", 400

        return str("OK")
    else:
        return "Missing attribute", 400

@app.route('/setLedsColour', methods=["POST"])
def setLedsColour():

    global myR, myG, myB, pulseRunning

    myR, myG, myB = getColoursFromRequest(request)

    if not pulseRunning:
        changeColour(myR, myG, myB)

    return str("OK")

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

    global strip, myR, myG, myB, FORMAT, CHANNELS, RATE, CHUNK, LED_COUNT, pulseRunning
    
    pulseRunning = True

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
        if(rms/100 > threshHold):
            strip.setPixelColor(LED_COUNT-1, Color(myR,myG,myB))

    stream.stop_stream()
    stream.close()
    p.terminate()

    print("Listener stopped")

app.run(port=18200, host="0.0.0.0", ssl_context=('/etc/letsencrypt/live/watzonservices.ddns.net/fullchain.pem', '/etc/letsencrypt/live/watzonservices.ddns.net/privkey.pem'))
