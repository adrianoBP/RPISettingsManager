// TODO: Return promise when making API calls

function SetLedsColour(red, green, blue) {

    fetch(`${endpointAddress}/setLedsColour`, {
        method: "POST",
        body: JSON.stringify({
            red: red,
            green: green,
            blue: blue,
        }),
        headers: { "Content-Type": "application/json" }
    }).then(function (response) {
        HandleResponse(response)
    })
}

function ChangePulseAction(action) {

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

function HandleResponseData(data) {

    if (IsNullOrEmpty(data)) {
        return;
    }
    data = JSON.parse(data)
    console.log(data);
}

function HandleResponse(response) {

    if (response.status != 204) {

        try {
            response.json().then(body => {

                if (response.status == 299 && !IsNullOrEmpty(body.message)){
                    ShowWarning(body.message);
                }
                else if (response.status >= 400 && response.status <= 499 && !IsNullOrEmpty(body.message)){
                    ShowErro(body.message);
                }
            })

        } catch (ex) {
            ShowError(ex)
        }
    }
}

