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

    messageElement.classList.remove("hidden");
    messageElement.style.opacity = 1;
    messageText.innerHTML = message;

    setTimeout(function () {

        HideMessage();
    }, duration)
}

function HideMessage() {

    messageElement.classList.add("hidden");
    messageElement.style.opacity = 0;
}