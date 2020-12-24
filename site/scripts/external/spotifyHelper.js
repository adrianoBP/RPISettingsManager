function SpotifyLogin() {

    window.open(`https://accounts.spotify.com/authorize?client_id=${config.SpotifyConfig.ClientID}&response_type=code&redirect_uri=https://watzonservices.ddns.net/Projects/RPISettingsManager/site&scope=${encodeURIComponent(`${"user-read-playback-state"}`)}`, "_self");
}

async function GetSpotifyToken(code) {

    return await MakeRequest("https://accounts.spotify.com/api/token", "POST", `grant_type=authorization_code` +
        `&code=${encodeURIComponent(code)}` +
        `&redirect_uri=${encodeURIComponent("https://watzonservices.ddns.net/Projects/RPISettingsManager/site")}`, {
        "Authorization": `Basic ${btoa(`${config.SpotifyConfig.ClientID}:${config.SpotifyConfig.ClientSecret}`)}`
    }, "application/x-www-form-urlencoded");
}

async function SpotifyPlayer(token) {

    return await MakeRequest("https://api.spotify.com/v1/me/player", "GET", null, {
        "Authorization": "Bearer " + token
    })
}

async function SpotifyCurrentlyPlaying(token) {

    return await MakeRequest("https://api.spotify.com/v1/me/player", "GET", null, {
        "Authorization": "Bearer " + token
    })
}