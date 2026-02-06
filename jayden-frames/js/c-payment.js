document.addEventListener("DOMContentLoaded", () => {
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

      // Change these to your real file paths
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
      // Change to your profile page path
      window.location.href = "../pages/profile.html";
    });
  }

  // =========================
  // 3) Promo Code Apply (demo)
  // =========================
  const promoInput = document.getElementById("pay-promo-input");
  const applyBtn = document.getElementById("pay-apply-btn");
  const totalEl = document.getElementById("pay-total-price");

  // Base total from HTML
  let baseTotal = parseCurrency(totalEl?.textContent || "$0.00");
  let discountedTotal = baseTotal;
  let appliedPromo = "";

  // Demo promo codes
  const promos = {
    SAVE5: 5.0,         // minus $5
    OFF10: 0.1,         // 10% off
    FREESHIP: 2.5,      // minus $2.50 (pretend shipping)
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

      // Prevent stacking promos in this demo
      if (appliedPromo) {
        alert(`Promo already applied: ${appliedPromo}`);
        return;
      }

      appliedPromo = code;

      // Calculate discount
      const value = promos[code];
      if (value < 1) {
        // percentage
        discountedTotal = round2(baseTotal * (1 - value));
      } else {
        // flat
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
      // Change to your points page path
      window.location.href = "../pages/points.html";
    });
  }

  // =========================
  // 5) Place order button
  // =========================
  const placeOrderBtn = document.getElementById("pay-place-order-btn");
  const payMethod = document.getElementById("pay-method");

  if (placeOrderBtn) {
    placeOrderBtn.addEventListener("click", () => {
      const method = (payMethod?.value || "").trim();

      if (!method) {
        alert("Please select a payment method.");
        payMethod?.focus();
        return;
      }

      // Save a simple order summary (useful for receipt page)
      const orderSummary = {
        paymentMethod: method,
        promoApplied: appliedPromo || null,
        total: discountedTotal,
        placedAt: new Date().toISOString(),
      };

      localStorage.setItem("last_order_summary", JSON.stringify(orderSummary));

      alert("Order placed successfully! (demo)");

      // Redirect to success / receipt page (change path)
      window.location.href = "../pages/order-success.html";
    });
  }

  // =========================
  // Helpers
  // =========================
  function parseCurrency(text) {
    // "$36.50" -> 36.5
    const cleaned = String(text).replace(/[^\d.]/g, "");
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : 0;
  }

  function updateTotal(el, value) {
    if (!el) return;
    el.textContent = `$${value.toFixed(2)}`;
  }

  function round2(n) {
    return Math.round(n * 100) / 100;
  }
});
