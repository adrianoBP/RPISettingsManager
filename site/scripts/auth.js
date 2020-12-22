var provider, db;

$.getJSON("./site.config", function (json) {
    const firebaseConfig = json.FirebaseConfig;

    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();

    provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().onAuthStateChanged(async function (user) {

        if (!IsNullOrEmpty(user)) {

            HandleLoginResult(user)

        } else {
            HideElement(mainContainer)
            ShowElement(loginContainer)
        }
    });

});

function GoogleLogIn() {

    console.log(loginContainer);

    firebase.auth().signInWithPopup(provider).then(async function (result) {

        HandleLoginResult(result.user)

    }).catch(function (error) {

        ShowError(error.message)
    });
}

function GoogleLogOut() {

    firebase.auth().signOut().then(function () {
        HideElement(mainContainer)
        ShowElement(loginContainer)
    }).catch(function (error) {
        ShowError(error.message)
    });
}

async function HandleLoginResult(user){

    var data = (await db.collection("users").doc(user.uid).get()).data();

    if(IsNullOrEmpty(data)){
        ShowError("User not allowed")
        GoogleLogOut()
    }
    else if (data.allowed) {
        HideElement(loginContainer)
        ShowElement(mainContainer)
    }
}