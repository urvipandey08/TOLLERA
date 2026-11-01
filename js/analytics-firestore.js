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

async function loadAnalytics() {
  let allTransactions = [];

  try {
    const snapshot = await getDocs(collection(db, "transactions"));
    if (!snapshot.empty) {
      allTransactions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
    } else {
      const saved = localStorage.getItem("tolleraTransactions");
      allTransactions = saved ? JSON.parse(saved) : (window.seedTransactions || []);
    }
  } catch (error) {
    console.warn("Could not load transactions for analytics from Firestore, using local store:", error);
    const saved = localStorage.getItem("tolleraTransactions");
    allTransactions = saved ? JSON.parse(saved) : (window.seedTransactions || []);
  }

  renderAnalyticsData(allTransactions);
}

function renderAnalyticsData(transactions) {
  const successful = transactions.filter((t) => t.status === "Success");
  const rejected = transactions.filter((t) => t.status === "Rejected");

  const totalRev = successful.reduce(
    (sum, t) => sum + Number(t.tollAmount ?? t.amount ?? 0),
    0
  );

  if ($("analyticsRevenue")) $("analyticsRevenue").textContent = money(totalRev);
  if ($("analyticsCrossings")) $("analyticsCrossings").textContent = successful.length;
  if ($("analyticsRejected")) $("analyticsRejected").textContent = rejected.length;

  // Category breakdown
  const cats = ["Bike", "Car", "Bus", "Truck"];
  const vals = cats.map((cat) => {
    const norm = cat.toLowerCase();
    return successful
      .filter((t) => {
        const c = String(t.category || t.vehicleType || "").toLowerCase();
        return c === norm;
      })
      .reduce((sum, t) => sum + Number(t.tollAmount ?? t.amount ?? 0), 0);
  });

  const maxVal = Math.max(...vals, 1);

  const categoryBarsEl = $("categoryBars");
  if (categoryBarsEl) {
    categoryBarsEl.innerHTML = cats
      .map((cat, i) => {
        const pct = Math.round((vals[i] / maxVal) * 100);
        return `
          <div class="barrow">
            <span>${cat}</span>
            <div class="bartrack">
              <div class="barfill" style="width: ${pct}%;"></div>
            </div>
            <span class="barvalue">${money(vals[i])}</span>
          </div>
        `;
      })
      .join("");
  }

  // Outcome ratios
  const total = successful.length + rejected.length;
  const successPct = total > 0 ? Math.round((successful.length / total) * 100) : 0;
  const rejectedPct = total > 0 ? (100 - successPct) : 0;

  if ($("successRate")) {
    $("successRate").textContent = total > 0 ? `${successPct}%` : "—";
  }
  if ($("successBar")) {
    $("successBar").style.width = `${total > 0 ? successPct : 0}%`;
  }
  if ($("rejectedBar")) {
    $("rejectedBar").style.width = `${total > 0 ? rejectedPct : 0}%`;
  }
}

function initAnalyticsPage() {
  loadAnalytics();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAnalyticsPage);
} else {
  initAnalyticsPage();
}

