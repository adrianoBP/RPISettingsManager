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

function SetLedsColour(red, green, blue) {

    fetch(`${endpointAddress}/setLedsColour`, {
        method: "POST",
        body: JSON.stringify({
            red: red,
            green: green,
            blue: blue,
        }),
        headers: {"Content-Type": "application/json"}
    }).then(resp => {
            console.log(resp.status)
    })
}