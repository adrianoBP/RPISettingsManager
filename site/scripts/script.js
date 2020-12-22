const endpointAddress = "https://watzonservices.ddns.net:18200"

// TODO: Loading

document.addEventListener("DOMContentLoaded", function (event) {
    init()
});

async function init() {

    SetDefaults()
}

function SubmitColor() {
    SetLedsColour(redSlider.value, greenSlider.value, blueSlider.value);
}

function TurnOffLeds() {
    SetLedsColour(0, 0, 0);
}

async function SetDefaults() {

    let defaults = await GetCurrentValues();

    if (IsNullOrEmpty(defaults))
        return;

    redSlider.value = defaults.red;
    greenSlider.value = defaults.green;
    blueSlider.value = defaults.blue;
    thresholdSlider.value = defaults.threshold;
}

async function TestAction() {

    console.log("TEST");
}

function IsNullOrEmpty(val) {
    if (Array.isArray(val))
        if (val.length == 0)
            return true;
    return val === undefined || val === null || val === "";
};