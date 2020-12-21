let messageElement = document.getElementById("message");
let messageIcon = messageElement.getElementsByTagName("i")[0];
let messageText = messageElement.getElementsByTagName("span")[0];

// TODO: Add message queue

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

function ShowMessage(message, duration = 6000) {

    messageElement.style.visibility = "visible";
    messageElement.style.opacity = 1;
    messageText.innerHTML = message;

    setTimeout(function () {

        HideMessage();
    }, duration)
}

function HideMessage() {

    messageElement.style.visibility = "hidden";
    messageElement.style.opacity = 0;
}