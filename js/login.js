import { auth } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";


// Check Firebase authentication status
onAuthStateChanged(auth, (user) => {

  if (user) {

    // Authenticated operator
    sessionStorage.removeItem("tolleraDemoMode");
    sessionStorage.removeItem("tolleraAuth");

    window.tolleraDemoMode = false;

  } else if (
    sessionStorage.getItem("tolleraDemoMode") === "true"
  ) {

    // Presentation-only demo mode
    window.tolleraDemoMode = true;

  } else {

    // No valid login or demo session
    sessionStorage.removeItem("tolleraAuth");
    window.location.replace("login.html");

  }

});
