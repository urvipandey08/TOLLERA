import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

const getElement = (id) => document.getElementById(id);

const formatMoney = (amount) =>
  "₹ " + Number(amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

let vehicles = [];

function showMessage(message) {
  if (window.toast) {
    window.toast(message);
  } else {
    const toast = getElement("toast");
    if (toast) {
      toast.textContent = message;
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 3200);
    } else {
      alert(message);
    }
  }
}

function openRegistrationModal() {
  const overlay = getElement("overlay");
  if (overlay) {
    overlay.classList.add("show");
    const regInput = getElement("registration");
    if (regInput) regInput.focus();
  }
}

function closeRegistrationModal() {
  const overlay = getElement("overlay");
  if (overlay) {
    overlay.classList.remove("show");
  }
  const form = getElement("vehicleForm");
  if (form) {
    form.reset();
    const bal = getElement("balance");
    if (bal) bal.value = 500;
  }
}

function normalize(str) {
  return String(str || "").trim().toUpperCase().replace(/\s+/g, "");
}

async function loadVehicles() {
  const table = getElement("vehicleRows");

  try {
    const result = await getDocs(collection(db, "vehicles"));

    if (!result.empty) {
      vehicles = result.docs.map((item) => {
        const data = item.data();
        return {
          id: item.id,
          registration: data.registrationNumber || data.registration || "",
          rfid: data.rfidUid || data.rfid || "",
          category: data.vehicleType || data.category || "Car",
          balance: Number(data.balance || 0),
          status: data.status || "Active"
        };
      });
      localStorage.setItem("tolleraVehicles", JSON.stringify(vehicles));
    } else {
      const saved = localStorage.getItem("tolleraVehicles");
      vehicles = saved ? JSON.parse(saved) : (window.seedVehicles || []);
    }
  } catch (error) {
    console.warn("Could not load vehicles from Firestore, using local data:", error);
    const saved = localStorage.getItem("tolleraVehicles");
    vehicles = saved ? JSON.parse(saved) : (window.seedVehicles || []);
  }

  updateMetrics();
  renderVehicles();
}

function updateMetrics() {
  const totalCountEl = getElement("totalCount");
  const activeCountEl = getElement("activeCount");
  const balanceTotalEl = getElement("balanceTotal");

  if (totalCountEl) totalCountEl.textContent = vehicles.length;
  if (activeCountEl) {
    activeCountEl.textContent = vehicles.filter((v) => v.status === "Active").length;
  }
  if (balanceTotalEl) {
    const totalBal = vehicles.reduce((sum, v) => sum + Number(v.balance || 0), 0);
    balanceTotalEl.textContent = formatMoney(totalBal);
  }
}

function renderVehicles() {
  const searchInput = getElement("search");
  const categoryFilter = getElement("categoryFilter");
  const statusFilter = getElement("statusFilter");

  const search = (searchInput?.value || "").toLowerCase().trim();
  const category = categoryFilter?.value || "all";
  const status = statusFilter?.value || "all";

  const filtered = vehicles.filter((v) => {
    const reg = v.registration || "";
    const rfid = v.rfid || "";
    const matchesSearch = !search || (reg + " " + rfid).toLowerCase().includes(search);
    const matchesCategory = category === "all" || v.category === category;
    const matchesStatus = status === "all" || v.status === status;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const table = getElement("vehicleRows");
  if (!table) return;

  table.replaceChildren();

  filtered.forEach((vehicle) => {
    const row = document.createElement("tr");

    // 1. Vehicle Registration Plate
    const regCell = document.createElement("td");
    const plate = document.createElement("span");
    plate.className = "plate clickable";
    plate.textContent = vehicle.registration;
    plate.title = "View vehicle profile";
    plate.addEventListener("click", () => {
      localStorage.setItem("tolleraSelectedVehicle", vehicle.registration);
      window.location.href = "vehicle-profile.html";
    });
    regCell.appendChild(plate);
    row.appendChild(regCell);

    // 2. RFID UID
    const rfidCell = document.createElement("td");
    rfidCell.textContent = vehicle.rfid;
    row.appendChild(rfidCell);

    // 3. Category
    const catCell = document.createElement("td");
    catCell.textContent = vehicle.category;
    row.appendChild(catCell);

    // 4. Balance
    const balanceCell = document.createElement("td");
    balanceCell.className = "balance";
    balanceCell.textContent = formatMoney(vehicle.balance);
    row.appendChild(balanceCell);

    // 5. Status
    const statusCell = document.createElement("td");
    const statusTag = document.createElement("span");
    statusTag.className = "tag " + (vehicle.status === "Active" ? "active" : "inactive");
    statusTag.textContent = vehicle.status;
    statusCell.appendChild(statusTag);
    row.appendChild(statusCell);

    // 6. Action Button
    const actionCell = document.createElement("td");
    const button = document.createElement("button");
    button.className = "rowaction";
    button.title = "View profile";
    button.innerHTML = '<span class="material-symbols-outlined">arrow_forward</span>';
    button.addEventListener("click", () => {
      localStorage.setItem("tolleraSelectedVehicle", vehicle.registration);
      window.location.href = "vehicle-profile.html";
    });
    actionCell.appendChild(button);
    row.appendChild(actionCell);

    table.appendChild(row);
  });

  const emptyEl = getElement("emptyState");
  if (emptyEl) {
    emptyEl.hidden = filtered.length > 0;
  }

  const rowCountEl = getElement("rowCount");
  if (rowCountEl) {
    rowCountEl.textContent = `SHOWING ${filtered.length} OF ${vehicles.length} VEHICLES`;
  }
}

async function registerVehicle(event) {
  event.preventDefault();

  const form = getElement("vehicleForm");
  const submitButton = form?.querySelector('button[type="submit"]');

  const regInput = getElement("registration");
  const rfidInput = getElement("rfid");
  const catInput = getElement("category");
  const balInput = getElement("balance");
  const statInput = getElement("status");

  const rawReg = (regInput?.value || "").trim().toUpperCase().replace(/\s+/g, " ");
  const rawRfid = (rfidInput?.value || "").trim().toUpperCase();
  const category = catInput?.value || "";
  const balance = Number(balInput?.value || 0);
  const status = statInput?.value || "Active";

  if (!rawReg || !rawRfid) {
    showMessage("Please enter the registration number and RFID UID.");
    return;
  }

  if (!["Bike", "Car", "Bus", "Truck"].includes(category)) {
    showMessage("Please select a valid vehicle category.");
    return;
  }

  if (!Number.isFinite(balance) || balance < 0) {
    showMessage("Please enter a valid initial balance.");
    return;
  }

  const normReg = normalize(rawReg);
  const normRfid = normalize(rawRfid);

  // Check duplicate against current list
  const regExists = vehicles.some((v) => normalize(v.registration) === normReg);
  if (regExists) {
    showMessage("This vehicle registration number already exists.");
    return;
  }

  const rfidExists = vehicles.some((v) => normalize(v.rfid) === normRfid);
  if (rfidExists) {
    showMessage("This RFID UID is already registered.");
    return;
  }

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "Saving...";
  }

  const newVehicle = {
    registration: rawReg,
    rfid: rawRfid,
    category: category,
    balance: balance,
    status: status,
    registered: new Date().toISOString().slice(0, 10)
  };

  try {
    // Try adding to Firestore
    await addDoc(collection(db, "vehicles"), {
      registrationNumber: rawReg,
      rfidUid: rawRfid,
      vehicleType: category,
      balance: balance,
      status: status,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.warn("Could not save to Firestore directly, saved to local store:", error);
  }

  // Update in-memory and local storage
  vehicles.unshift(newVehicle);
  localStorage.setItem("tolleraVehicles", JSON.stringify(vehicles));

  updateMetrics();
  renderVehicles();
  closeRegistrationModal();
  showMessage("Vehicle registered successfully!");

  if (submitButton) {
    submitButton.disabled = false;
    submitButton.textContent = "Save vehicle";
  }
}

function initVehiclesPage() {
  const openButton = getElement("openModal");
  const closeButton = getElement("closeModal");
  const cancelButton = getElement("cancelModal");
  const overlay = getElement("overlay");
  const form = getElement("vehicleForm");

  if (openButton) openButton.addEventListener("click", openRegistrationModal);
  if (closeButton) closeButton.addEventListener("click", closeRegistrationModal);
  if (cancelButton) cancelButton.addEventListener("click", closeRegistrationModal);

  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeRegistrationModal();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeRegistrationModal();
  });

  if (form) {
    form.addEventListener("submit", registerVehicle);
  }

  getElement("search")?.addEventListener("input", renderVehicles);
  getElement("categoryFilter")?.addEventListener("change", renderVehicles);
  getElement("statusFilter")?.addEventListener("change", renderVehicles);

  loadVehicles();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initVehiclesPage);
} else {
  initVehiclesPage();
}
