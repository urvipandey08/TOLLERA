import { db } from "./firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

const $ = (id) => document.getElementById(id);

const money = (amount) =>
  "₹ " + Number(amount || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0
  });

function normalize(value) {
  return String(value || "")
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "");
}

function parseDate(ts) {
  if (!ts) return "—";
  try {
    if (typeof ts.toDate === "function") {
      return ts.toDate().toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
      });
    }
    const d = new Date(ts);
    if (!isNaN(d.getTime())) {
      return d.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
      });
    }
  } catch (e) {
    console.warn("Date parse error:", e);
  }
  return String(ts);
}

function getTimeMillis(item) {
  if (!item || !item.timestamp) return 0;
  if (typeof item.timestamp.toMillis === "function") {
    return item.timestamp.toMillis();
  }
  if (typeof item.timestamp.toDate === "function") {
    return item.timestamp.toDate().getTime();
  }
  const d = new Date(item.timestamp);
  return isNaN(d.getTime()) ? 0 : d.getTime();
}

async function loadVehicleProfile() {
  let registration = localStorage.getItem("tolleraSelectedVehicle");

  let allVehicles = [];
  try {
    const snapshot = await getDocs(collection(db, "vehicles"));
    if (!snapshot.empty) {
      allVehicles = snapshot.docs.map((item) => item.data());
    } else {
      const saved = localStorage.getItem("tolleraVehicles");
      allVehicles = saved ? JSON.parse(saved) : (window.seedVehicles || []);
    }
  } catch (error) {
    console.warn("Firestore vehicle fetch failed, using local store:", error);
    const saved = localStorage.getItem("tolleraVehicles");
    allVehicles = saved ? JSON.parse(saved) : (window.seedVehicles || []);
  }

  // If no vehicle selected, default to first available
  if (!registration && allVehicles.length > 0) {
    const first = allVehicles[0];
    registration = first.registrationNumber || first.registration || "";
    if (registration) {
      localStorage.setItem("tolleraSelectedVehicle", registration);
    }
  }

  const normTarget = normalize(registration);

  const vehicleData = allVehicles.find((v) => {
    const reg = v.registrationNumber || v.registration || "";
    return normalize(reg) === normTarget;
  });

  const setText = (id, value) => {
    const el = $(id);
    if (el) el.textContent = value;
  };

  if (!vehicleData) {
    setText("profileTitle", registration || "Vehicle Not Found");
    setText("profileCategory", "Unknown");
    setText("profileRfid", "—");
    setText("profileBalance", money(0));
    setText("profileStatus", "Inactive");
    setText("profileCrossings", "0");
    setText("profileDeductions", money(0));
    return;
  }

  const regDisplay = vehicleData.registrationNumber || vehicleData.registration || registration;
  const catDisplay = vehicleData.vehicleType || vehicleData.category || "Car";
  const rfidDisplay = vehicleData.rfidUid || vehicleData.rfid || "—";
  const balDisplay = money(vehicleData.balance || 0);
  const statusDisplay = vehicleData.status || "Active";

  setText("profileTitle", regDisplay);
  setText("profileCategory", catDisplay);
  setText("profileRfid", rfidDisplay);
  setText("profileBalance", balDisplay);

  const statusEl = $("profileStatus");
  if (statusEl) {
    statusEl.textContent = statusDisplay;
    statusEl.className = "tag " + (statusDisplay === "Active" ? "active" : "inactive");
  }

  await loadVehicleTransactions(regDisplay, normTarget);
}

async function loadVehicleTransactions(regDisplay, normTarget) {
  const history = $("profileHistory");
  if (!history) return;

  let allTx = [];

  try {
    const snapshot = await getDocs(collection(db, "transactions"));
    if (!snapshot.empty) {
      allTx = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
    } else {
      const saved = localStorage.getItem("tolleraTransactions");
      allTx = saved ? JSON.parse(saved) : (window.seedTransactions || []);
    }
  } catch (error) {
    console.warn("Firestore transactions fetch failed, using local store:", error);
    const saved = localStorage.getItem("tolleraTransactions");
    allTx = saved ? JSON.parse(saved) : (window.seedTransactions || []);
  }

  // Filter transactions in memory (avoids composite index requirement in Firestore)
  const vehicleTx = allTx.filter((t) => {
    const reg = t.vehicleRegistration || t.registration || "";
    return normalize(reg) === normTarget;
  });

  vehicleTx.sort((a, b) => getTimeMillis(b) - getTimeMillis(a));

  // Compute crossings and deductions
  const successfulTx = vehicleTx.filter((t) => t.status === "Success");
  const crossings = successfulTx.length;
  const deductions = successfulTx.reduce(
    (sum, t) => sum + Number(t.tollAmount ?? t.amount ?? 0),
    0
  );

  const crossingsEl = $("profileCrossings");
  if (crossingsEl) crossingsEl.textContent = crossings;

  const deductionsEl = $("profileDeductions");
  if (deductionsEl) deductionsEl.textContent = money(deductions);

  history.replaceChildren();

  if (vehicleTx.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 7;
    cell.className = "empty";
    cell.textContent = "No transactions recorded for this vehicle yet.";
    row.appendChild(cell);
    history.appendChild(row);
    return;
  }

  vehicleTx.forEach((item) => {
    const row = document.createElement("tr");

    const dateStr = parseDate(item.timestamp || item.time);
    const rfid = item.rfidUid || item.rfid || "—";
    const category = item.category || item.vehicleType || "—";
    const toll = Number(item.tollAmount ?? item.amount ?? 0);
    const statusVal = item.status || "Success";
    const balanceAfter = item.balanceAfter !== undefined && item.balanceAfter !== null
      ? (typeof item.balanceAfter === "number" ? money(item.balanceAfter) : item.balanceAfter)
      : "—";

    // 1. Date/time
    const tdDate = document.createElement("td");
    tdDate.textContent = dateStr;
    row.appendChild(tdDate);

    // 2. Vehicle Plate
    const tdPlate = document.createElement("td");
    const plate = document.createElement("span");
    plate.className = "plate";
    plate.textContent = regDisplay;
    tdPlate.appendChild(plate);
    row.appendChild(tdPlate);

    // 3. RFID ID
    const tdRfid = document.createElement("td");
    tdRfid.textContent = rfid;
    row.appendChild(tdRfid);

    // 4. Category
    const tdCat = document.createElement("td");
    tdCat.textContent = category;
    row.appendChild(tdCat);

    // 5. Toll
    const tdToll = document.createElement("td");
    tdToll.className = "balance";
    tdToll.textContent = money(toll);
    row.appendChild(tdToll);

    // 6. Status tag
    const tdStatus = document.createElement("td");
    const tag = document.createElement("span");
    tag.className = "tag " + (statusVal === "Success" ? "success" : "rejected");
    tag.textContent = statusVal;
    tdStatus.appendChild(tag);
    row.appendChild(tdStatus);

    // 7. Balance After
    const tdBal = document.createElement("td");
    tdBal.className = "balance";
    tdBal.textContent = balanceAfter;
    row.appendChild(tdBal);

    history.appendChild(row);
  });
}

function initVehicleProfilePage() {
  loadVehicleProfile();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initVehicleProfilePage);
} else {
  initVehicleProfilePage();
}
