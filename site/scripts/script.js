const endpointAddress = "https://watzonservices.ddns.net:18200"

// TODO: Loading
let config, spotifyToken, localStorage;;

document.addEventListener("DOMContentLoaded", async function (event) {

    localStorage = window.localStorage;

    config = await GetConfig();

    const urlParams = new URLSearchParams(window.location.search);
    init(urlParams);
});

async function init(urlParams) {

    InitTheme();

    SetDefaults()
    InitFirebase(config.FirebaseConfig);
    InitSpotify(urlParams.get('code'));
}

function SubmitColor() {
    SetLedsColour(redSlider.value, greenSlider.value, blueSlider.value);
}

function TurnOffLeds() {
    SetLedsColour(0, 0, 0);
    redSlider.value = 0;
    greenSlider.value = 0;
    blueSlider.value = 0;
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

function GetConfig() {

    return new Promise((resolve, reject) => {

        $.getJSON("./site.config", async function (json) {

            if (!IsNullOrEmpty(json)) {
                resolve(json);
            }

            reject("Unable to retrieve the configuration");
        });
    })
}

function Logout(){

    // Spotify
    localStorage.removeItem("spotifyToken");
    ShowElement(spotifyLoginButton);
    HideSpotifyPlayer();
    StopSpotifyWorkers();

    // Firebase
    GoogleLogOut();
}