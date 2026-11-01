import { db, auth } from "./firebase.js";
import {
  collection,
  getDocs,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

const categories = [
  { id: "bike", name: "Bike", icon: "two_wheeler", defaultAmount: 20 },
  { id: "car", name: "Car", icon: "directions_car", defaultAmount: 50 },
  { id: "bus", name: "Bus", icon: "directions_bus", defaultAmount: 80 },
  { id: "truck", name: "Truck", icon: "local_shipping", defaultAmount: 100 }
];

const rateGrid = document.getElementById("rateGrid");
const saveButton = document.getElementById("saveRates");

let rates = {};

function showMessage(message) {
  if (window.toast) {
    window.toast(message);
  } else {
    const toast = document.getElementById("toast");
    if (toast) {
      toast.textContent = message;
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 3200);
    } else {
      alert(message);
    }
  }
}

function formatMoney(amount) {
  return "₹ " + Number(amount || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0
  });
}

async function loadRates() {
  if (rateGrid) {
    rateGrid.innerHTML = '<div class="empty">Loading toll rates...</div>';
  }

  try {
    const snapshot = await getDocs(collection(db, "rates"));

    rates = {};

    if (!snapshot.empty) {
      snapshot.forEach((item) => {
        const data = item.data();
        const amt = data.amount ?? data.tollAmount;
        if (amt !== undefined) {
          rates[item.id.toLowerCase()] = Number(amt);
        }
      });
    }

    // Fill missing from defaults or local storage
    const saved = localStorage.getItem("tolleraRates");
    const localRates = saved ? JSON.parse(saved) : (window.seedRates || {});

    categories.forEach((category) => {
      if (!(category.id in rates)) {
        rates[category.id] = localRates[category.id] ?? category.defaultAmount;
      }
    });

    localStorage.setItem("tolleraRates", JSON.stringify(rates));
  } catch (error) {
    console.warn("Could not load toll rates from Firestore, using local defaults:", error);
    const saved = localStorage.getItem("tolleraRates");
    const localRates = saved ? JSON.parse(saved) : (window.seedRates || {});

    categories.forEach((category) => {
      rates[category.id] = localRates[category.id] ?? category.defaultAmount;
    });
  }

  renderRates();
}

function renderRates() {
  if (!rateGrid) return;
  rateGrid.replaceChildren();

  categories.forEach((category) => {
    const card = document.createElement("article");
    card.className = "rate";

    const currentAmount = rates[category.id] ?? category.defaultAmount;

    // Kind label
    const kindDiv = document.createElement("div");
    kindDiv.className = "kind";
    kindDiv.textContent = category.name;

    // Price display
    const priceDiv = document.createElement("div");
    priceDiv.className = "price";
    priceDiv.id = "price-" + category.id;
    priceDiv.innerHTML = `${formatMoney(currentAmount)}<small> / crossing</small>`;

    // Formfield wrapper
    const fieldLabel = document.createElement("label");
    fieldLabel.className = "formfield";

    const metricSpan = document.createElement("span");
    metricSpan.className = "metric-label";
    metricSpan.textContent = "Toll amount (₹)";

    const input = document.createElement("input");
    input.id = "rate-" + category.id;
    input.type = "number";
    input.min = "0";
    input.max = "100000";
    input.step = "1";
    input.required = true;
    input.value = currentAmount;

    input.addEventListener("input", () => {
      const val = Number(input.value);
      if (input.value !== "" && Number.isFinite(val) && val >= 0) {
        priceDiv.innerHTML = `${formatMoney(val)}<small> / crossing</small>`;
      }
    });

    fieldLabel.append(metricSpan, input);
    card.append(kindDiv, priceDiv, fieldLabel);
    rateGrid.appendChild(card);
  });
}

async function saveRates() {
  const newRates = {};

  for (const category of categories) {
    const input = document.getElementById("rate-" + category.id);
    if (!input) continue;

    const amount = Number(input.value);

    if (
      input.value.trim() === "" ||
      !Number.isFinite(amount) ||
      amount < 0 ||
      amount > 100000
    ) {
      showMessage(`Enter a valid rate for ${category.name} between ₹0 and ₹100,000.`);
      input.focus();
      return;
    }

    newRates[category.id] = amount;
  }

  if (saveButton) {
    saveButton.disabled = true;
    saveButton.innerHTML = '<span class="material-symbols-outlined">save</span> Saving...';
  }

  try {
    for (const category of categories) {
      const data = {
        category: category.name.toUpperCase(),
        amount: newRates[category.id]
      };

      await setDoc(doc(db, "rates", category.id), data);
    }
  } catch (error) {
    console.warn("Firestore rate save note (using local cache):", error);
  }

  rates = newRates;
  localStorage.setItem("tolleraRates", JSON.stringify(rates));
  renderRates();
  showMessage("Toll rates saved successfully!");

  if (saveButton) {
    saveButton.disabled = false;
    saveButton.innerHTML = '<span class="material-symbols-outlined">save</span> Save rates';
  }
}

function initRatesPage() {
  if (saveButton) {
    saveButton.addEventListener("click", saveRates);
  }
  loadRates();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initRatesPage);
} else {
  initRatesPage();
}
