let body = document.body;

// Containers
let loginContainer = document.getElementById("login-container");
let mainContainer = document.getElementById("main-container");


let redSlider = document.getElementById("red-slider");
let greenSlider = document.getElementById("green-slider");
let blueSlider = document.getElementById("blue-slider");
let thresholdSlider = document.getElementById("threshold-slider");

let messageElement = document.getElementById("message");
let messageIcon = messageElement.getElementsByTagName("i")[0];
let messageText = messageElement.getElementsByTagName("span")[0];

// Spotify
let spotifyContent = document.getElementById("spotify-content");
let spotifyLoginButton = document.getElementById("spotify-login-button");
let spotifyPreviousButton = document.getElementById("spotify-previous-button");
let spotifyNextButton = document.getElementById("spotify-next-button");
let spotifyStartStopButton = document.getElementById("spotify-start-stop-button");
let spotifyStartStopIcon= document.getElementById("spotify-start-stop-icon");
let spotifyCurrentlyPlayingText = document.getElementById("spotify-currently-playing");
let spotifyVolumePercent = document.getElementById("spotify-volume");
let spotifyVolumePercentMobile = document.getElementById("spotify-volume-mobile");