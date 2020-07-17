(function () {

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

    // Variables
    const username = document.getElementById("username");  
    const password = document.getElementById("password");  
    const btnLogin = document.getElementById("btnLogin");
    const btnSignup = document.getElementById("btnSignup");
    const btnLogout = document.getElementById("btnLogout");
    
    // Add login event
    btnLogin.addEventListener('click', e => {
        const email = username.value;
        const pass = password.value;
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
        const email = username.value;
        const pass = password.value;
        const auth = firebase.auth();

        // Sign in
        const promise = auth.createUserWithEmailAndPassword(email, pass);

        // Error handling
        promise.catch(e => {
            console.log(e.message);
        });
    })

    firebase.auth().onAuthStateChanged(firebaseUser => {
        if(firebaseUser) {
            console.log(firebaseUser); // TODO remove later
            btnLogin.hidden = true;
            btnSignup.hidden = true;
            btnLogout.hidden = false;
            alert('hello ' + firebaseUser.email);
        } else {
            btnLogin.hidden = false;
            btnSignup.hidden = false;
            btnLogout.hidden = true;
        }
    })
}());