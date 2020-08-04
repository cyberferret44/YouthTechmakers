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

    firebase.auth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
            console.log(firebaseUser); // TODO remove later
            btnLogin.hidden = true;
            btnSignup.hidden = true;
            btnLogout.hidden = false;
            alert('hello ' + firebaseUser.email); // TODO remove later
        } else {
            btnLogin.hidden = false;
            btnSignup.hidden = false;
            btnLogout.hidden = true;
        }
    })
}

function initButtons() {
    // Login Variables
    const usernameLogin = document.getElementById("signin-email");
    const passwordLogin = document.getElementById("signin-password");

    // Sign Up Variables
    const signupUsername = document.getElementById("signup-username");
    const signupEmail = document.getElementById("signup-email");
    const signupPassword = document.getElementById("signup-password");
    const signupPasswordVerify = document.getElementById("signup-password-verify");

    // Recover Password Variables
    const resetPasswordEmail = document.getElementById("reset-email");

    // Buttons
    const btnLogin = document.getElementById("btnLogin");
    const btnSignup = document.getElementById("btnSignup");
    const btnLogout = document.getElementById("btnLogout");
    const btnResetPassword = document.getElementById("btnResetPassword");

    // Add login event
    btnLogin.addEventListener('click', e => {
        const email = usernameLogin.value;
        const pass = passwordLogin.value;
        const auth = firebase.auth();

        // Sign in
        const promise = auth.signInWithEmailAndPassword(email, pass);

        // Error handling
        promise.catch(e => {
            console.log(e.message);
            alert('Invalid Login');
        });
    })

    // Add log out
    btnLogout.addEventListener('click', e => {
        firebase.auth().signOut();
    })

    // Add sign up event
    btnSignup.addEventListener('click', e => {
        const username = signupUsername.value;
        const email = signupEmail.value;
        const pass = signupPassword.value;
        const passVerify = signupPasswordVerify.value;
        const auth = firebase.auth();

        if(pass !== passVerify) {
            alert("Passwords do not match!"); // TODO make this a proper css error
        } else {
            // Sign in
            const promise = auth.createUserWithEmailAndPassword(email, pass);

            // Error handling
            promise.catch(e => {
                console.log(e.message);
            });
        }
    })
}

$(document).ready(function () {
    const loginModalContent = document.getElementById("login-modal-content");
    if (loginModalContent) {
        $("#login-modal-content").load("templates/login-modal-template.html", function () {
            initButtons(); // initialize the buttons when done loading
        });
    }
    initFirebase();
});