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

	// TEMPLATES
	// TODO MAKE INTO PROMISES
    $("#login-modal-content").load("templates/login-modal-template.html", function () {
        $("#navbar-general").load("templates/navbar2.html", function () {
            initializeEverything(); // initialize everything when done loading templates
    	});
    });
});