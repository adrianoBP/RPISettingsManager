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
        } else {
            ShowError(ex)
        }
    }
}

async function ChangePulseAction(action) {

    fetch(`${endpointAddress}/changePulseAction`, {
        method: "POST",
        body: JSON.stringify({
            action: action
        }),
        headers: { "Content-Type": "application/json" }
    }).then(function (response) {
        HandleResponse(response)
    })
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
        } else {
            ShowError(ex)
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
        } else {
            ShowError(ex)
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

function HandleResponseData(data) {

    if (IsNullOrEmpty(data)) {
        return;
    }
    data = JSON.parse(data)
    console.log(data);
}

function HandleResponse(response) {

    if (response.statusCode != 204) {

        try {
            if (response.statusCode == 299 && !IsNullOrEmpty(response.data)) {
                ShowWarning(response.data.message);
            }
            else if (response.statusCode >= 400 && response.statusCode <= 499 && !IsNullOrEmpty(response.data)) {
                ShowErro(response.data.message);
            }

        } catch (ex) {
            ShowError(ex)
        }
    }
}


