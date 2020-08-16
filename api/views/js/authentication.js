// ***************************************************
// *************** FIREBASE INIT *********************
// ***************************************************
$(document).ready(function () {
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

	// Only initialize buttons if we load the templates successfully
	$("#navbar-general").load("templates/navbar2.html", function () {
		initializeEverything(); // initialize everything when done loading templates
	});
});

// ***************************************************
// ***************** VARIABLES ***********************
// ***************************************************
var shouldSendVerificationEmail = false;

// ***************************************************
// *************** USER FUNCTIONS ********************
// ***************************************************
function getUserId() {
	return firebase.auth().currentUser ? firebase.auth().currentUser.uid : null;
}

function getUsername() {
	var auth = firebase.auth();
	if (auth.currentUser) {
		var email = auth.currentUser.email;
		return email.substring(0, email.lastIndexOf("@"));
	} else {
		return null;
	}
}

function initializeEverything() {
	// ***************************************************
	// *************** BUTTON STUFF **********************
	// ***************************************************
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
	const btnLaunchSigninModal = document.getElementById("btnLaunchSigninModal");

	// Add login event
	btnLogin.addEventListener('click', e => {
		const email = usernameLogin.value;
		const pass = passwordLogin.value;
		const auth = firebase.auth();

		// Sign in
		const promise = auth.signInWithEmailAndPassword(email, pass);

		// Error handling
		promise
			.then(() => {
				$('.cd-user-modal').removeClass('is-visible');  // Dismiss modal after successful login
			})
			.catch(e => {
				console.log(e.message); // TODO remove this later
				$('#signin-email-error').html('Password is incorrect or user does not exist');
				$('#signin-email').toggleClass('has-error').next('span').toggleClass('is-visible');
			});
	});

	// Add log out
	btnLogout.addEventListener('click', e => {
		firebase.auth().signOut();
	});

	// Add sign up event
	btnSignup.addEventListener('click', e => {
		const email = signupEmail.value;
		const pass = signupPassword.value;
		const passVerify = signupPasswordVerify.value;
		const auth = firebase.auth();

		if (pass !== passVerify) {
			$('#signup-password-error').html('Passwords do not match!');
			$('#signup-password').toggleClass('has-error').next('span').toggleClass('is-visible');
		} else {
			// Sign in
			const promise = auth.createUserWithEmailAndPassword(email, pass);
			shouldSendVerificationEmail = true;

			// Error handling
			promise
				.then(() => {
					$('.cd-user-modal').removeClass('is-visible');  // Dismiss modal after successful signup
				})
				.catch(e => {
					console.log(e.message);
				});
		}
	});

	// disable error messages on change
	// Sign in
	$('#signin-email').on('input', function() {
		$('#signin-email').removeClass('has-error').next('span').removeClass('is-visible');
		$('#signin-password').removeClass('has-error').next('span').removeClass('is-visible');
	});
	$('#signin-password').on('input', function() {
		$('#signin-email').removeClass('has-error').next('span').removeClass('is-visible');
		$('#signin-password').removeClass('has-error').next('span').removeClass('is-visible');
	});

	// Sign up
	$('#signup-email').on('input', function() {
		$('#signup-email').removeClass('has-error').next('span').removeClass('is-visible');
	});
	$('#signup-password').on('input', function() {
		$('#signup-password').removeClass('has-error').next('span').removeClass('is-visible');
		$('#signup-password-verify').removeClass('has-error').next('span').removeClass('is-visible');
	});
	$('#signup-password-verify').on('input', function() {
		$('#signup-password').removeClass('has-error').next('span').removeClass('is-visible');
		$('#signup-password-verify').removeClass('has-error').next('span').removeClass('is-visible');
	});

	// Forgot email
	$('#reset-email').on('input', function() {
		$('#reset-email').removeClass('has-error').next('span').removeClass('is-visible');
	});

	// Show/Hide buttons based on user state
	firebase.auth().onAuthStateChanged(firebaseUser => {
		if (firebaseUser) {
			if (firebaseUser.emailVerified) {
				// TODO load session info??
			} else if(this.shouldSendVerificationEmail) {
				firebaseUser.sendEmailVerification();
				alert('A verification email has been sent to ' + firebaseUser.email);
			} else {
				alert('Your email is not verified.  Please confirm the email sent to ' + firebaseUser.email);
			}
			btnLaunchSigninModal.style = "display: none;";
			btnLogout.style = "";
		} else {
			btnLaunchSigninModal.style = "";
			btnLogout.style = "display: none;";
		}
	});

	// ***************************************************
	// *************** OTHER LOGIN STUFF *****************
	// ***************************************************
	var $form_modal = $('.cd-user-modal'),
		$form_login = $form_modal.find('#cd-login'),
		$form_signup = $form_modal.find('#cd-signup'),
		$form_forgot_password = $form_modal.find('#cd-reset-password'),
		$form_modal_tab = $('.cd-switcher'),
		$tab_login = $form_modal_tab.children('li').eq(0).children('a'),
		$tab_signup = $form_modal_tab.children('li').eq(1).children('a'),
		$forgot_password_link = $form_login.find('.cd-form-bottom-message a'),
		$back_to_login_link = $form_forgot_password.find('.cd-form-bottom-message a'),
		$main_nav = $('.main-nav');

	//open modal
	$main_nav.on('click', function (event) {
		if ($(event.target).is($main_nav)) {
			// on mobile open the submenu
			$(this).children('ul').toggleClass('is-visible');
		} else {
			// on mobile close submenu
			$main_nav.children('ul').removeClass('is-visible');
			//show modal layer
			if ($(event.target).is('.cd-signin')) {
				$form_modal.addClass('is-visible');
				login_selected();
			}
		}
	});

	//close modal
	$('.cd-user-modal').on('click', function (event) {
		if ($(event.target).is($form_modal) || $(event.target).is('.cd-close-form')) {
			$form_modal.removeClass('is-visible');
		}
	});

	//close modal when clicking the esc keyboard button
	$(document).keyup(function (event) {
		if (event.which == '27') {
			$form_modal.removeClass('is-visible');
		}
	});

	//switch from a tab to another
	$form_modal_tab.on('click', function (event) {
		event.preventDefault();
		($(event.target).is($tab_login)) ? login_selected() : signup_selected();
	});

	//show forgot-password form 
	$forgot_password_link.on('click', function (event) {
		event.preventDefault();
		forgot_password_selected();
	});

	//back to login from the forgot-password form
	$back_to_login_link.on('click', function (event) {
		event.preventDefault();
		login_selected();
	});

	function login_selected() {
		$form_login.addClass('is-selected');
		$form_signup.removeClass('is-selected');
		$form_forgot_password.removeClass('is-selected');
		$tab_login.addClass('selected');
		$tab_signup.removeClass('selected');
	}

	function signup_selected() {
		$form_login.removeClass('is-selected');
		$form_signup.addClass('is-selected');
		$form_forgot_password.removeClass('is-selected');
		$tab_login.removeClass('selected');
		$tab_signup.addClass('selected');
	}

	function forgot_password_selected() {
		$form_login.removeClass('is-selected');
		$form_signup.removeClass('is-selected');
		$form_forgot_password.addClass('is-selected');
	}
}

// TODO remove this, I think it's unnecessary
//credits https://css-tricks.com/snippets/jquery/move-cursor-to-end-of-textarea-or-input/
jQuery.fn.putCursorAtEnd = function () {
	return this.each(function () {
		// If this function exists...
		if (this.setSelectionRange) {
			// ... then use it (Doesn't work in IE)
			// Double the length because Opera is inconsistent about whether a carriage return is one character or two. Sigh.
			var len = $(this).val().length * 2;
			this.setSelectionRange(len, len);
		} else {
			// ... otherwise replace the contents with itself
			// (Doesn't work in Google Chrome)
			$(this).val($(this).val());
		}
	});
};