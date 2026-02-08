// c-successful-payment.js (MODULE)
// Loads the latest order from Firestore using lastOrderId,
// shows a 40-minute timer, and does NOT auto-create a guest user.

import { db, auth, waitForAuthUser } from "../../firebase/firebase.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
  // =========================
  // ELEMENTS
  // =========================
  const orderMoreBtn = document.getElementById("checkout-success-order-more-btn");
  const menuBtn = document.getElementById("checkout-success-menu-btn");
  const profileBtn = document.getElementById("checkout-success-profile");

  const listEl = document.getElementById("checkout-success-order-list");
  const deliveryEl = document.getElementById("cs-delivery-fee");
  const gstEl = document.getElementById("cs-gst");
  const totalEl = document.getElementById("checkout-success-total");

  const timerEl = document.getElementById("cs-timer");
  const timerNoteEl = document.getElementById("cs-timer-note");

  // =========================
  // HELPERS (must be inside so they can access listEl, etc.)
  // =========================
  function money(n) {
    return `$${Number(n || 0).toFixed(2)}`;
  }

  function showEmpty(msg) {
    if (listEl) listEl.innerHTML = `<p style="margin:0; color:#555;">${msg}</p>`;
    if (deliveryEl) deliveryEl.textContent = "$0.00";
    if (gstEl) gstEl.textContent = "$0.00";
    if (totalEl) totalEl.textContent = "Total: $0.00";
  }

  // =========================
  // AUTH: DO NOT CREATE GUEST
  // =========================
  // Wait for Firebase to restore the signed-in user (email/password)
  const user = await waitForAuthUser();

  // If not logged in, or is anonymous, redirect to login
  if (!user || user.isAnonymous) {
    showEmpty("You are not logged in. Redirecting to login...");
    setTimeout(() => {
      window.location.href = "c-logindetails.html"; // change if your login filename differs
    }, 800);
    return;
  }

  // Optional: quick debug
  console.log("Logged in as:", user.uid, user.email || "(no email)");

  // =========================
  // TIMER (40 minutes)
  // =========================
  if (timerEl) {
    const DURATION_SECONDS = 40 * 60;

    // Use order-based key so each order has its own timer
    const orderIdForTimer = localStorage.getItem("lastOrderId") || "no_order";
    const key = `deliveryTimerStart_${orderIdForTimer}`;

    const existingStart = localStorage.getItem(key);
    const startTime = existingStart ? Number(existingStart) : Date.now();
    if (!existingStart) localStorage.setItem(key, String(startTime));

    function formatTime(seconds) {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }

    function tick() {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, DURATION_SECONDS - elapsed);

      timerEl.textContent = formatTime(remaining);

      if (remaining === 0) {
        if (timerNoteEl) timerNoteEl.textContent = "Delivered! Enjoy your meal 🍽️";
        clearInterval(interval);
      }
    }

    tick();
    const interval = setInterval(tick, 1000);
  }

  // =========================
  // LOAD ORDER FROM FIRESTORE
  // =========================
  try {
    const orderId = localStorage.getItem("lastOrderId");
    if (!orderId) {
      showEmpty("No recent order found (missing order id).");
      return;
    }

    // Collection name is "order" (singular) based on your setup
    const snap = await getDoc(doc(db, "order", orderId));

    if (!snap.exists()) {
      showEmpty("Order not found in Firebase.");
      return;
    }

    const order = snap.data();

    // ✅ Security check: ensure this order belongs to the logged-in user
    if (order.customeruid !== user.uid) {
      showEmpty("This order does not belong to your account.");
      return;
    }

    // Render items
    if (!order.items || order.items.length === 0) {
      showEmpty("No items in this order.");
    } else if (listEl) {
      listEl.innerHTML = "";
      order.items.forEach((it, idx) => {
        const row = document.createElement("div");
        row.className = "cs-order-item";
        row.id = `checkout-success-item-${idx + 1}`;
        row.innerHTML = `
          <span class="cs-qty">${Number(it.qty || 0)}x</span>
          <span class="cs-name">${it.name || "Item"}</span>
          <span class="cs-price">${money((Number(it.price || 0)) * (Number(it.qty || 0)))}</span>
        `;
        listEl.appendChild(row);
      });
    }

    // Fees + totals (match your Firestore field names)
    const delivery = order.deliveryfee ?? 0;
    const gst = order.gst ?? 0;
    const total = order.total ?? ((order.subtotal ?? 0) + delivery + gst);

    if (deliveryEl) deliveryEl.textContent = money(delivery);
    if (gstEl) gstEl.textContent = money(gst);
    if (totalEl) totalEl.textContent = `Total: ${money(total)}`;

  } catch (err) {
    console.error("Load order error:", err);
    showEmpty("Failed to load order details.");
  }

  // =========================
  // BUTTONS
  // =========================
  if (orderMoreBtn) {
    orderMoreBtn.addEventListener("click", () => {
      // Optional: clear order id so it won't show old order next time
      // localStorage.removeItem("lastOrderId");
      window.location.href = "../../kayden-pages/search.html"; // change to your real page
    });
  }

  if (menuBtn) menuBtn.addEventListener("click", () => alert("Menu clicked"));
  if (profileBtn) profileBtn.addEventListener("click", () => alert("Open profile"));
})
