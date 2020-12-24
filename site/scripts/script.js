const endpointAddress = "https://watzonservices.ddns.net:18200"

// TODO: Loading
let config, spotifyToken;

document.addEventListener("DOMContentLoaded", async function (event) {

    config = await GetConfig();

    const urlParams = new URLSearchParams(window.location.search);
    const spotifyCode = urlParams.get('code')

    // TODO: Spotify init
    // TODO: Save spotify token in local/session storage
    if (!IsNullOrEmpty(spotifyCode)) {

        try {
            spotifyToken = (await GetSpotifyToken(spotifyCode)).data.access_token;

            let spotifyPlayingData = await SpotifyCurrentlyPlaying(spotifyToken)

            spotifyCurrentlyPlaying.innerHTML = `${spotifyPlayingData.data.item.name} - ${spotifyPlayingData.data.item.album.artists[0].name}`
            ShowElement(spotifyCurrentlyPlaying)
            HideElement(spotifyButton);

        }catch(ex){

            if(!IsNullOrEmpty(ex.data))
                if(ex.data.error == "invalid_grant"){
                    console.log("Silent error: unable to retrieve Spotify Token - Page was probably reloaded");
                    // window.location.replace(window.location.pathname); // Remove all URL parameters
                }
                else
                    ShowError(ex)
            else
                ShowError(ex)
        }
    }

    init()
});

async function init() {

    SetDefaults()
    InitFirebase(config.FirebaseConfig);
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