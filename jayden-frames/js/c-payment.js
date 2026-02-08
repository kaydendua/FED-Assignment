// c-payment.js
// IMPORTANT: In payment.html use:
// <script type="module" src="../jayden-frames/js/c-payment.js"></script>

import { db, getCurrentUser } from "../../firebase/firebase.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // 0) Load total from checkout
  // =========================
  const totalEl = document.getElementById("pay-total-price");

  const savedTotalText = localStorage.getItem("checkoutTotal");
  if (totalEl && savedTotalText) {
    totalEl.textContent = savedTotalText;
  }

  // Base total from UI
  let baseTotal = parseCurrency(totalEl?.textContent || "$0.00");
  let discountedTotal = baseTotal;
  let appliedPromo = "";

  // =========================
  // 1) Menu dropdown
  // =========================
  const menuBtn = document.querySelector(".menu-btn");
  const navbar = document.querySelector(".navbar");

  const dropdown = document.createElement("div");
  dropdown.className = "menu-dropdown";
  dropdown.hidden = true;
  dropdown.innerHTML = `
    <a href="#" data-go="home">Home</a>
    <a href="#" data-go="for-you">For You</a>
    <a href="#" data-go="search">Search</a>
    <a href="#" data-go="points">Points</a>
    <a href="#" data-go="profile">Profile</a>
  `;

  if (navbar) navbar.appendChild(dropdown);

  if (menuBtn) {
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.hidden = !dropdown.hidden;
    });
  }

  document.addEventListener("click", () => {
    dropdown.hidden = true;
  });

  dropdown.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  dropdown.querySelectorAll("a[data-go]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = link.dataset.go;

      // ✅ Change these to your real file paths
      const routes = {
        home: "../pages/home.html",
        "for-you": "../pages/for-you.html",
        search: "../pages/search.html",
        points: "../pages/points.html",
        profile: "../pages/profile.html",
      };

      if (routes[target]) window.location.href = routes[target];
    });
  });

  // =========================
  // 2) Avatar click -> Profile
  // =========================
  const avatar = document.getElementById("pay-avatar");
  if (avatar) {
    avatar.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "../pages/profile.html"; // change path if needed
    });
  }

  // =========================
  // 3) Promo Code Apply (demo)
  // =========================
  const promoInput = document.getElementById("pay-promo-input");
  const applyBtn = document.getElementById("pay-apply-btn");

  // Demo promo codes
  const promos = {
    SAVE5: 5.0,            // minus $5
    OFF10: 0.1,            // 10% off
    FREESHIP: "FREESHIP",  // subtract $4 delivery fee (demo)
  };

  if (applyBtn) {
    applyBtn.addEventListener("click", () => {
      const code = (promoInput?.value || "").trim().toUpperCase();

      if (!code) {
        alert("Please enter a promo code.");
        return;
      }

      if (!promos[code]) {
        alert("Invalid promo code (demo). Try: SAVE5 / OFF10 / FREESHIP");
        return;
      }

      if (appliedPromo) {
        alert(`Promo already applied: ${appliedPromo}`);
        return;
      }

      appliedPromo = code;

      // Re-read base total
      baseTotal = parseCurrency(totalEl?.textContent || "$0.00");
      discountedTotal = baseTotal;

      const value = promos[code];

      if (value === "FREESHIP") {
        discountedTotal = round2(Math.max(0, baseTotal - 4.0));
      } else if (value < 1) {
        discountedTotal = round2(baseTotal * (1 - value));
      } else {
        discountedTotal = round2(Math.max(0, baseTotal - value));
      }

      updateTotal(totalEl, discountedTotal);
      alert(`Promo applied: ${code}`);
    });
  }

  // =========================
  // 4) Points to claim click
  // =========================
  const pointsRow = document.getElementById("pay-points-row");
  if (pointsRow) {
    pointsRow.addEventListener("click", () => {
      window.location.href = "../pages/points.html"; // change if needed
    });
  }

  // =========================
  // 5) Place order button (WRITE TO FIRESTORE)
  // =========================
  const placeOrderBtn = document.getElementById("pay-place-order-btn");
  const payMethod = document.getElementById("pay-method");

  if (placeOrderBtn) {
    placeOrderBtn.addEventListener("click", async () => {
      const method = (payMethod?.value || "").trim();

      if (!method) {
        alert("Please select a payment method.");
        payMethod?.focus();
        return;
      }

      // Ensure a user exists (anonymous guest or logged-in)
      const user = await getCurrentUser();
      if (!user) {
        alert("Unable to identify user.");
        return;
      }

      // Read cart items
      const cartRaw = localStorage.getItem("cartItems");
      const cartItems = cartRaw ? JSON.parse(cartRaw) : [];

      if (!Array.isArray(cartItems) || cartItems.length === 0) {
        alert("Your cart is empty.");
        return;
      }

      // Subtotal from cart (recommended)
      const subtotal = round2(
        cartItems.reduce(
          (sum, i) => sum + (Number(i.price) || 0) * (Number(i.qty) || 1),
          0
        )
      );

      const deliveryFee = 4.0;
      const gst = round2(subtotal * 0.09);
      const total = round2(subtotal + deliveryFee + gst);

      // Build Firestore items array (matches your "items (array)" structure)
      const items = cartItems.map((i) => ({
        itemid: i.itemid || i.itemId || "UNKNOWN",
        name: i.name || "Item",
        price: Number(i.price) || 0,
        qty: Number(i.qty) || 1,
      }));

      const orderDoc = {
        createdat: serverTimestamp(),
        customeruid: user.uid,
        items,
        subtotal,
        deliveryfee: deliveryFee,
        gst,
        total,
        paymentmethod: method,
        promoapplied: appliedPromo || null,
        orderstatus: "placed",
      };

      try {
        // NOTE: Your collection name in Firestore is "order" (singular)
        const docRef = await addDoc(collection(db, "order"), orderDoc);

        // Save orderId for success page to load
        localStorage.setItem("lastOrderId", docRef.id);

        // Clear cart after order is placed
        localStorage.removeItem("cartItems");
        localStorage.removeItem("checkoutTotal");

        // Redirect to success page (fix path if needed)
        window.location.href = "c-successful-payment.html";
      } catch (err) {
        console.error("Firestore addDoc error:", err);
        alert("Failed to place order. Check console for details.");
      }
    });
  }

  // =========================
  // Helpers
  // =========================
  function parseCurrency(text) {
    const cleaned = String(text).replace(/[^\d.]/g, "");
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : 0;
  }

  function updateTotal(el, value) {
    if (!el) return;
    el.textContent = `$${Number(value).toFixed(2)}`;
  }

  function round2(n) {
    return Math.round(n * 100) / 100;
  }
});
