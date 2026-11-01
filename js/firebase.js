import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyANx2IU23TbFC7IrvyOD8KOnZWCjevZSwo",
  authDomain: "tollrfid-c53a8.firebaseapp.com",
  projectId: "tollrfid-c53a8",
  storageBucket: "tollrfid-c53a8.firebasestorage.app",
  messagingSenderId: "708905719693",
  appId: "1:708905719693:web:f1b60e2782a4823de90fc4",
  measurementId: "G-M1PEW52M4Q"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };