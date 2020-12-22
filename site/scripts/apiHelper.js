async function SetLedsColour(red, green, blue) {

    const request = {
        red: red,
        green: green,
        blue: blue,
    }

    try {
        var response = await MakeRequest(`${endpointAddress}/setLedsColour`, "POST", request);
        HandleResponse(response);
    } catch (ex) {

        if (!IsNullOrEmpty(ex.statusCode) && !IsNullOrEmpty(ex.data)) {
            ShowError(ex.data.message)
        } else if (typeof ex == "string") {
            ShowError(ex)
        } else {
            ShowError("SetLedsColour: Unexpected exception")
        }
    }
}

async function ChangePulseAction(action) {

    const request = {
        action: action
    }

    try {
        var response = await MakeRequest(`${endpointAddress}/changePulseAction`, "POST", request);
        HandleResponse(response);
    } catch (ex) {

        if (!IsNullOrEmpty(ex.statusCode) && !IsNullOrEmpty(ex.data)) {
            ShowError(ex.data.message)
        } else if (typeof ex == "string") {
            ShowError(ex)
        } else {
            ShowError("ChangePulseAction: Unexpected exception")
        }
    }
}

async function SetPulseThreshold(threshold) {

    const request = {
        threshold: threshold
    }

    try {
        var response = await MakeRequest(`${endpointAddress}/setPulseThreshold`, "POST", request);
        HandleResponse(response);
    } catch (ex) {

        if (!IsNullOrEmpty(ex.statusCode) && !IsNullOrEmpty(ex.data)) {
            ShowError(ex.data.message)
        } else if (typeof ex == "string") {
            ShowError(ex)
        } else {
            ShowError("SetPulseThreshold: Unexpected exception")
        }
    }
}

async function GetCurrentValues() {

    try {
        let response = await MakeRequest(`${endpointAddress}/getCurrentValues`, "POST");
        return response.data;
    } catch (ex) {

        if (!IsNullOrEmpty(ex.statusCode) && !IsNullOrEmpty(ex.data)) {
            ShowError(ex.data.message)
        } else if (typeof ex == "string") {
            ShowError(ex)
        } else {
            ShowError("GetCurrentValues: Unexpected exception")
        }
    }
}

function MakeRequest(url, method, body = "") {

    return new Promise((resolve, reject) => {

        $.ajax({
            type: method,
            url: url,
            data: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json"
            }
        }).done((data, statusText, xhr) => {
            resolve({
                data: IsNullOrEmpty(data) ? "" : JSON.parse(data),
                statusCode: xhr.status
            })
        }).fail((xhr, _, statusText) => {
            reject({
                data: IsNullOrEmpty(xhr.responseText) ? "" : JSON.parse(xhr.responseText),
                statusCode: xhr.status
            });
        });
    })

}

function HandleResponse(response) {

    if (response.statusCode != 204) {

        try {
            if (response.statusCode == 299 && !IsNullOrEmpty(response.data)) {
                ShowWarning(response.data.message);
            }
            else if (response.statusCode >= 400 && response.statusCode <= 499 && !IsNullOrEmpty(response.data)) {
                ShowError(response.data.message);
            }

        } catch (ex) {
            ShowError(ex)
        }
    }
}