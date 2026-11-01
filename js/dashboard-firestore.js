import { db } from "./firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

const $ = (id) => document.getElementById(id);

const money = (amount) =>
  "₹ " + Number(amount || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

let allTransactions = [];
let allVehicles = [];

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

async function loadDashboard() {
  try {
    const vehicleSnapshot = await getDocs(collection(db, "vehicles"));
    const transactionSnapshot = await getDocs(collection(db, "transactions"));

    if (!vehicleSnapshot.empty) {
      allVehicles = vehicleSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      localStorage.setItem("tolleraVehicles", JSON.stringify(allVehicles));
    } else {
      const saved = localStorage.getItem("tolleraVehicles");
      allVehicles = saved ? JSON.parse(saved) : (window.seedVehicles || []);
    }

    if (!transactionSnapshot.empty) {
      allTransactions = transactionSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      localStorage.setItem("tolleraTransactions", JSON.stringify(allTransactions));
    } else {
      const saved = localStorage.getItem("tolleraTransactions");
      allTransactions = saved ? JSON.parse(saved) : (window.seedTransactions || []);
    }
  } catch (error) {
    console.warn("Firestore fetch failed, loading local fallback data:", error);
    const savedV = localStorage.getItem("tolleraVehicles");
    allVehicles = savedV ? JSON.parse(savedV) : (window.seedVehicles || []);

    const savedT = localStorage.getItem("tolleraTransactions");
    allTransactions = savedT ? JSON.parse(savedT) : (window.seedTransactions || []);
  }

  updateMetrics();
  renderTransactions();
}

function updateMetrics() {
  const successful = allTransactions.filter(
    (item) => item.status === "Success"
  );
  const rejected = allTransactions.filter(
    (item) => item.status === "Rejected"
  );

  const totalRev = successful.reduce(
    (sum, item) => sum + Number(item.tollAmount ?? item.amount ?? 0),
    0
  );

  if ($("revenueMetric")) $("revenueMetric").textContent = money(totalRev);
  if ($("crossingMetric")) $("crossingMetric").textContent = successful.length;
  if ($("vehicleMetric")) $("vehicleMetric").textContent = allVehicles.length;
  if ($("rejectedMetric")) $("rejectedMetric").textContent = rejected.length;
}

function renderTransactions() {
  const rows = $("transactionRows");
  if (!rows) return;

  const searchInput = $("transactionSearch");
  const statusSelect = $("transactionStatus");

  const search = (searchInput?.value || "").toLowerCase().trim();
  const status = statusSelect?.value || "all";

  const filtered = allTransactions.filter((item) => {
    const reg = item.vehicleRegistration || item.registration || "";
    const rfid = item.rfidUid || item.rfid || "";
    const matchesSearch = !search || (reg + " " + rfid).toLowerCase().includes(search);
    const matchesStatus = status === "all" || item.status === status;
    return matchesSearch && matchesStatus;
  });

  filtered.sort((a, b) => getTimeMillis(b) - getTimeMillis(a));

  rows.replaceChildren();

  filtered.forEach((item) => {
    const row = document.createElement("tr");

    const dateStr = parseDate(item.timestamp || item.time);
    const reg = item.vehicleRegistration || item.registration || "—";
    const rfid = item.rfidUid || item.rfid || "—";
    const category = item.category || item.vehicleType || "—";
    const toll = Number(item.tollAmount ?? item.amount ?? 0);
    const statusVal = item.status || "Unknown";
    const balanceAfter = item.balanceAfter !== undefined && item.balanceAfter !== null
      ? (typeof item.balanceAfter === "number" ? money(item.balanceAfter) : item.balanceAfter)
      : "—";

    // 1. Date/time
    const tdDate = document.createElement("td");
    tdDate.textContent = dateStr;
    row.appendChild(tdDate);

    // 2. Vehicle plate
    const tdPlate = document.createElement("td");
    const plateSpan = document.createElement("span");
    plateSpan.className = "plate clickable";
    plateSpan.textContent = reg;
    plateSpan.title = "View vehicle profile";
    plateSpan.addEventListener("click", () => {
      if (reg && reg !== "—" && reg !== "UNKNOWN") {
        localStorage.setItem("tolleraSelectedVehicle", reg);
        window.location.href = "vehicle-profile.html";
      }
    });
    tdPlate.appendChild(plateSpan);
    row.appendChild(tdPlate);

    // 3. RFID
    const tdRfid = document.createElement("td");
    tdRfid.textContent = rfid;
    row.appendChild(tdRfid);

    // 4. Category
    const tdCat = document.createElement("td");
    tdCat.textContent = category;
    row.appendChild(tdCat);

    // 5. Toll Amount
    const tdToll = document.createElement("td");
    tdToll.className = "balance";
    tdToll.textContent = money(toll);
    row.appendChild(tdToll);

    // 6. Status tag
    const tdStatus = document.createElement("td");
    const tagSpan = document.createElement("span");
    tagSpan.className = "tag " + (statusVal === "Success" ? "success" : "rejected");
    tagSpan.textContent = statusVal;
    tdStatus.appendChild(tagSpan);
    row.appendChild(tdStatus);

    // 7. Balance after
    const tdBal = document.createElement("td");
    tdBal.className = "balance";
    tdBal.textContent = balanceAfter;
    row.appendChild(tdBal);

    rows.appendChild(row);
  });

  const emptyEl = $("transactionEmpty");
  if (emptyEl) {
    emptyEl.hidden = filtered.length > 0;
  }

  const countEl = $("transactionCount");
  if (countEl) {
    countEl.textContent = `SHOWING ${filtered.length} OF ${allTransactions.length} TRANSACTIONS`;
  }
}

function exportTransactionsCSV() {
  const headers = [
    "Date / time",
    "Vehicle",
    "RFID ID",
    "Category",
    "Toll",
    "Status",
    "Balance after"
  ];

  const escapeCSV = (value) =>
    '"' + String(value ?? "").replace(/"/g, '""') + '"';

  const rows = Array.from(
    $("transactionRows").querySelectorAll("tr")
  ).map((row) =>
    Array.from(row.querySelectorAll("td")).map(
      (cell) => cell.textContent.trim()
    )
  );

  if (rows.length === 0) {
    if (window.toast) window.toast("No transactions to export.");
    return;
  }

  const csv = [headers, ...rows]
    .map((row) => row.map(escapeCSV).join(","))
    .join("\r\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `tollera-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  if (window.toast) window.toast("Transactions CSV exported.");
}

function initDashboard() {
  $("transactionSearch")?.addEventListener("input", renderTransactions);
  $("transactionStatus")?.addEventListener("change", renderTransactions);
  $("exportCsv")?.addEventListener("click", exportTransactionsCSV);

  loadDashboard();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDashboard);
} else {
  initDashboard();
}
