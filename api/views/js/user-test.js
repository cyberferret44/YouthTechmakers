function initFirebase() {

    // Initialize Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyDyS-Fh-ECqjW8ZDz3y3SDn6JYVqnwDRvE",
        authDomain: "youthtechmakers.firebaseapp.com",
        databaseURL: "https://youthtechmakers.firebaseio.com",
        projectId: "youthtechmakers",
        storageBucket: "youthtechmakers.appspot.com",
        messagingSenderId: "227350567149",
        appId: "1:227350567149:web:213b0ade6418d550dd54e4",
        measurementId: "G-3YK97L34B9"
    };
    firebase.initializeApp(firebaseConfig);
}

$(document).ready(function () {
	// FIREBASE STUFF
	initFirebase();
});

function getUserId() {
    return firebase.auth().currentUser ? firebase.auth().currentUser.uid : null;
}

function getUsername() {
    var auth = firebase.auth();
    if(auth.currentUser) {
        if(auth.currentUser.displayName) {
            return auth.currentUser.displayName;
        } else {
            var email = auth.currentUser.email;
            return email.substring(0, email.lastIndexOf("@"));
        }
    } else {
        return null;
    }
}

function testMethod2() {
    document.getElementById("demo2").innerHTML = getUsername();
}