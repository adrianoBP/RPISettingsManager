// TODO: Re-authorize on expire
// TODO: Automatically connect to default device
// TODO: Show top 5 playlists
// TODO: Music volume

let spotifyCurrentlyPlayingWorker, spotifyPlaying, spotifyIgnoreNextUpdate = false;

async function InitSpotify(spotifyCode) {

    let spotifyToken = localStorage.getItem("spotifyToken");

    try {

        HideSpotifyPlayer();
        ShowElement(spotifyLoginButton);

        if (IsNullOrEmpty(spotifyToken)) {  // If there's no token saved

            if (!IsNullOrEmpty(spotifyCode)) {  // If there's a code in the URL try to authorize
                spotifyToken = (await GetSpotifyToken(spotifyCode)).data.access_token;
                localStorage.setItem("spotifyToken", spotifyToken);
            } else {
                return;
            }
        } else {
            if (!IsNullOrEmpty(spotifyCode))
                window.location.replace(window.location.pathname); // Remove access code from URL
        }

        spotifyCurrentlyPlayingWorker = setInterval(SpotifyGetCurrentlyPlayingDetails, 1000);

        ShowSpotifyPlayer();
        HideElement(spotifyLoginButton);

    } catch (ex) {

        if (!IsNullOrEmpty(ex.data))
            if (ex.data.error == "invalid_grant") {
                console.log("Silent error: unable to retrieve Spotify Token - Page was probably reloaded");
                window.location.replace(window.location.pathname); // Remove all URL parameters
            }
            else
                ShowError(ex);
        else
            ShowError(ex);
    }
}

async function SpotifyGetCurrentlyPlayingDetails() {

    try {
        let spotifyToken = localStorage.getItem("spotifyToken");
        let spotifyPlayingData = await SpotifyCurrentlyPlaying(spotifyToken);

        if (!spotifyIgnoreNextUpdate && !pointerActive) {
            spotifyVolumePercent.value = spotifyVolumePercentMobile.value = spotifyPlayingData.data.device.volume_percent;
            spotifyCurrentlyPlayingText.innerHTML = `${spotifyPlayingData.data.item.name} - ${spotifyPlayingData.data.item.album.artists[0].name}`;
        } else {
            spotifyIgnoreNextUpdate = false;
        }

        if (spotifyPlayingData.data.is_playing != spotifyPlaying) {

            spotifyPlaying = spotifyPlayingData.data.is_playing;
            ChangeSpotifyPlayingIcon(spotifyPlaying)
        }

    } catch (ex) {
        if (!IsNullOrEmpty(spotifyCurrentlyPlayingWorker)) {
            clearInterval(spotifyCurrentlyPlayingWorker);
        }

        if (!IsNullOrEmpty(ex.data)) {

            if (ex.data.error.message == "The access token expired") {

                localStorage.setItem("spotifyToken", "");
                InitSpotify();
                // HideSpotifyPlayer();
                // ShowElement(spotifyLoginButton);
            }
        }
    }
}

function StopSpotifyWorkers() {

    if (!IsNullOrEmpty(spotifyCurrentlyPlayingWorker))
        clearInterval(spotifyCurrentlyPlayingWorker);
}

function SpotifyLogin() {

    let requiredPermissions = `${"user-read-playback-state"} ${"user-modify-playback-state"}`;
    window.open(`https://accounts.spotify.com/authorize?client_id=${config.SpotifyConfig.ClientID}&response_type=code&redirect_uri=https://watzonservices.ddns.net/Projects/RPISettingsManager/site&scope=${encodeURIComponent(requiredPermissions)}`, "_self");
}

function SpotifyStartStopSong() {

    if (spotifyPlaying) {
        SpotifyPauseSong();
    } else {
        SpotifyPlaySong();
    }

    spotifyPlaying = !spotifyPlaying;
    ChangeSpotifyPlayingIcon(spotifyPlaying);
}

async function GetSpotifyToken(code) {

    return await MakeRequest("https://accounts.spotify.com/api/token", "POST", `grant_type=authorization_code` +
        `&code=${encodeURIComponent(code)}` +
        `&redirect_uri=${encodeURIComponent("https://watzonservices.ddns.net/Projects/RPISettingsManager/site")}`, {
        "Authorization": `Basic ${btoa(`${config.SpotifyConfig.ClientID}:${config.SpotifyConfig.ClientSecret}`)}`
    }, "application/x-www-form-urlencoded");
}

async function SpotifyCurrentlyPlaying(token) {

    return await MakeRequest("https://api.spotify.com/v1/me/player", "GET", null, {
        "Authorization": "Bearer " + token
    })
}

async function SpotifyChangeVolume(volumne) {

    spotifyIgnoreNextUpdate = true;
    pointerActive = false;

    return await MakeRequest(`https://api.spotify.com/v1/me/player/volume?volume_percent=${volumne}`, "PUT", null, {
        "Authorization": "Bearer " + localStorage.getItem("spotifyToken")
    })
}

async function SpotifyPreviousSong() {

    return await MakeRequest("https://api.spotify.com/v1/me/player/previous", "POST", null, {
        "Authorization": "Bearer " + localStorage.getItem("spotifyToken")
    })
}

async function SpotifyPauseSong() {

    return await MakeRequest("https://api.spotify.com/v1/me/player/pause", "PUT", null, {
        "Authorization": "Bearer " + localStorage.getItem("spotifyToken")
    })
}

async function SpotifyPlaySong() {

    return await MakeRequest("https://api.spotify.com/v1/me/player/play", "PUT", null, {
        "Authorization": "Bearer " + localStorage.getItem("spotifyToken")
    })
}

async function SpotifyNextSong() {

    return await MakeRequest("https://api.spotify.com/v1/me/player/next", "POST", null, {
        "Authorization": "Bearer " + localStorage.getItem("spotifyToken")
    })
}