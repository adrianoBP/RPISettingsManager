var firebaseProvider, firebaseDB;

function InitFirebase(firebaseConfigData){

    const firebaseConfig = firebaseConfigData;
    firebase.initializeApp(firebaseConfig);
    firebaseDB = firebase.firestore();

    firebaseProvider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().onAuthStateChanged(async function (user) {

        if (!IsNullOrEmpty(user)) {

            HandleGoogleLoginResult(user)

        } else {
            HideElement(mainContainer)
            ShowElement(loginContainer)
        }
    });
}

function GoogleLogIn() {

    console.log(loginContainer);

    firebase.auth().signInWithPopup(firebaseProvider).then(async function (result) {

        HandleGoogleLoginResult(result.user)

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

async function HandleGoogleLoginResult(user){

    var data = (await firebaseDB.collection("users").doc(user.uid).get()).data();

    if(IsNullOrEmpty(data)){
        ShowError("User not allowed")
        GoogleLogOut()
    }
    else if (data.allowed) {
        HideElement(loginContainer)
        ShowElement(mainContainer)
    }
}