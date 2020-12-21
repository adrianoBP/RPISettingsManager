let redSlider = document.getElementById("red-slider");
let greenSlider = document.getElementById("green-slider");
let blueSlider = document.getElementById("blue-slider");

const endpointAddress = "https://watzonservices.ddns.net:18200"

function SubmitColor() {
    SetLedsColour(redSlider.value, greenSlider.value, blueSlider.value);
}

function TurnOffLeds() {
    SetLedsColour(0, 0, 0);
}

function TestAction(){

    console.log("TEST");
}

function IsNullOrEmpty(str) {
    return str === null || str.match(/^ *$/) !== null;
}