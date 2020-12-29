// TODO: Add message queue
// TODO: Clear all messages

var pointerActive = false;
document.body.addEventListener('pointerdown', () => {
    pointerActive = true;
}, false);
document.body.addEventListener('pointerup', () => {
    pointerActive = false;
}, true);

function ShowSuccess(message, duration) {

    messageElement.className = "message raised green";
    messageIcon.className = "far fa-check-circle fa-2x";
    ShowMessage(message, duration);
}

function ShowWarning(message, duration) {

    messageElement.className = "message raised yellow";
    messageIcon.className = "fas fa-exclamation-triangle fa-2x";
    ShowMessage(message, duration);
}

function ShowError(message, duration) {

    messageElement.className = "message raised red";
    messageIcon.className = "fas fa-times-circle fa-2x";
    ShowMessage(message, duration);
}

function ShowInfo(message, duration) {

    messageElement.className = "message raised blue";
    messageIcon.className = "fas fa-info-circle fa-2x";
    ShowMessage(message, duration);
}

function ShowMessage(message, duration = 3500) {

    ShowElement(messageElement)
    messageText.innerHTML = message;

    setTimeout(function () {

        HideElement(messageElement);
    }, duration)
}

function ShowElement(element) {
    element.classList.remove("hidden");
    element.style.opacity = 1;
}

function ShowElementsBulk(elements) {
    for (let element of elements) {
        element.classList.remove("hidden");
        element.style.opacity = 1;
    }
}

function HideElement(element) {
    element.classList.add("hidden");
    element.style.opacity = 0;
}

function HideElementsBulk(elements) {
    for (let element of elements) {
        element.classList.add("hidden");
        element.style.opacity = 0;
    }
}

// Theme
function InitTheme() {

    const theme = localStorage.getItem("theme");

    if (!IsNullOrEmpty(theme)) {
        ChangeTheme(theme);
    }
}

function ChangeTheme(theme) {

    if (theme == "light-theme") {
        body.classList.replace("dark-theme", "light-theme");
    } else {
        body.classList.replace("light-theme", "dark-theme");
    }

    localStorage.setItem("theme", theme);
}

// Spotify
function ShowSpotifyPlayer() {

    ShowElementsBulk([spotifyContent, spotifyPreviousButton, spotifyNextButton, spotifyStartStopButton, spotifyVolumePercent]);
}

function HideSpotifyPlayer() {

    HideElementsBulk([spotifyContent, spotifyPreviousButton, spotifyNextButton, spotifyStartStopButton, spotifyVolumePercent]);
    spotifyCurrentlyPlayingText.innerHTML = "";
}

function ChangeSpotifyPlayingIcon(isPlaying = true) {

    if (!isPlaying) {
        spotifyStartStopIcon.classList.replace("fa-pause", "fa-play")
    } else {
        spotifyStartStopIcon.classList.replace("fa-play", "fa-pause")
    }
}