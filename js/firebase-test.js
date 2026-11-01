import { db } from "./firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

async function testFirestore() {
  try {
    const snapshot = await getDocs(collection(db, "vehicles"));

    console.log("✅ Firestore read successful!");
    console.log("Vehicles found:", snapshot.size);

    snapshot.forEach((doc) => {
      console.log("Vehicle:", doc.data());
    });
  } catch (error) {
    console.error("❌ Firestore read failed:", error.code);
    console.error(error.message);
  }
}

testFirestore();