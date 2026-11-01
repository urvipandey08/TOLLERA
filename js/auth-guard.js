import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

if (sessionStorage.getItem("tolleraAuth") === "true") {
  // Session active
} else {
  onAuthStateChanged(auth, (user) => {
    if (!user && sessionStorage.getItem("tolleraAuth") !== "true") {
      window.location.replace("login.html");
    }
  });
}
