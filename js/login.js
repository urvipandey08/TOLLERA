import { auth } from "./firebase.js";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";


const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const loginButton = document.getElementById("loginButton");
const guestBtn = document.getElementById("guestBtn");
const toggleModeBtn = document.getElementById("toggleModeBtn");
const toggleText = document.getElementById("toggleText");
const formTitle = document.getElementById("formTitle");
const formDesc = document.getElementById("formDesc");

let isCreateMode = false;


// ------------------------------
// MESSAGE HANDLING
// ------------------------------

function showMsg(text, isError = true) {
  if (!loginMessage) return;

  loginMessage.textContent = text;
  loginMessage.className = "msg " + (isError ? "error" : "success");
}

function clearMsg() {
  if (!loginMessage) return;

  loginMessage.textContent = "";
  loginMessage.className = "msg";
}


// ------------------------------
// FIREBASE AUTHENTICATION CHECK
// ------------------------------

onAuthStateChanged(auth, (user) => {
  if (user) {
    // A real Firebase-authenticated user is signed in.
    sessionStorage.removeItem("tolleraDemoMode");
    sessionStorage.removeItem("tolleraAuth");

    window.location.replace("index.html");
  }
});


// ------------------------------
// LOGIN / CREATE ACCOUNT MODE
// ------------------------------

if (toggleModeBtn) {
  toggleModeBtn.addEventListener("click", () => {

    isCreateMode = !isCreateMode;

    clearMsg();

    if (isCreateMode) {

      formTitle.textContent = "Create Operator Account";

      formDesc.textContent =
        "Register a new operator with Firebase Authentication.";

      loginButton.textContent = "Create Account";

      toggleText.textContent = "Already have an account?";

      toggleModeBtn.textContent = "Sign in";

    } else {

      formTitle.textContent = "Welcome back";

      formDesc.textContent =
        "Sign in to access your toll operations dashboard.";

      loginButton.textContent = "Sign in";

      toggleText.textContent = "Need a new operator account?";

      toggleModeBtn.textContent = "Create account";
    }

  });
}


// ------------------------------
// DEMO OPERATOR MODE
// ------------------------------

if (guestBtn) {

  guestBtn.addEventListener("click", () => {

    // Demo mode is separate from Firebase authentication.
    sessionStorage.setItem("tolleraDemoMode", "true");

    // Remove the old insecure authentication flag.
    sessionStorage.removeItem("tolleraAuth");

    showMsg(
      "Opening TOLLÉRA Demo Mode. Real toll transactions are disabled.",
      false
    );

    guestBtn.disabled = true;

    setTimeout(() => {
      window.location.replace("index.html");
    }, 500);

  });

}


// ------------------------------
// LOGIN FORM SUBMISSION
// ------------------------------

if (loginForm) {

  loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value;

    loginButton.disabled = true;

    if (guestBtn) {
      guestBtn.disabled = true;
    }

    loginButton.textContent = isCreateMode
      ? "Creating account..."
      : "Signing in...";

    clearMsg();

    try {

      if (isCreateMode) {

        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        sessionStorage.removeItem("tolleraDemoMode");
        sessionStorage.removeItem("tolleraAuth");

        showMsg(
          "Account created successfully! Opening TOLLÉRA...",
          false
        );

      } else {

        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        sessionStorage.removeItem("tolleraDemoMode");
        sessionStorage.removeItem("tolleraAuth");

        showMsg(
          "Login successful. Opening TOLLÉRA...",
          false
        );

      }

      // Firebase authentication listener handles navigation.

    } catch (error) {

      console.error(
        "Authentication error:",
        error.code,
        error.message
      );

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/invalid-login-credentials" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {

        showMsg(
          "Incorrect email or password. Please try again or contact an authorized operator."
        );

      } else if (error.code === "auth/email-already-in-use") {

        showMsg(
          "This email is already registered. Please sign in instead."
        );

      } else if (error.code === "auth/weak-password") {

        showMsg(
          "Password must be at least 6 characters."
        );

      } else if (error.code === "auth/too-many-requests") {

        showMsg(
          "Too many attempts. Please wait before trying again."
        );

      } else if (error.code === "auth/network-request-failed") {

        showMsg(
          "Unable to connect to Firebase. Please check your internet connection and try again."
        );

      } else {

        showMsg(
          error.message || "Unable to complete request. Please try again."
        );

      }

    } finally {

      loginButton.disabled = false;

      if (guestBtn) {
        guestBtn.disabled = false;
      }

      loginButton.textContent = isCreateMode
        ? "Create Account"
        : "Sign in";

    }

  });

}
