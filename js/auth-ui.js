import { auth } from "./firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

function setupAuthUI() {
  const signOutBtn = document.getElementById("signOutBtn");

  if (signOutBtn) {
    signOutBtn.addEventListener("click", async () => {
      signOutBtn.disabled = true;
      signOutBtn.textContent = "Signing out...";

      try {
        sessionStorage.removeItem("tolleraAuth");
        await signOut(auth);
      } catch (error) {
        console.warn("Sign out note:", error);
      } finally {
        sessionStorage.removeItem("tolleraAuth");
        window.location.replace("login.html");
      }
    });
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupAuthUI);
} else {
  setupAuthUI();
}
