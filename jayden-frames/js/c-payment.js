document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // 0) Load total from checkout
  // =========================
  const totalEl = document.getElementById("pay-total-price");

  // If you saved from checkout:
  // localStorage.setItem("checkoutTotal", "$12.34");
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
    SAVE5: 5.0,     // minus $5
    OFF10: 0.1,     // 10% off
    FREESHIP: "FREESHIP", // optional: remove delivery fee later if you want
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

      // Re-read base total in case it changed
      baseTotal = parseCurrency(totalEl?.textContent || "$0.00");
      discountedTotal = baseTotal;

      const value = promos[code];

      if (value === "FREESHIP") {
        // If you later store delivery fee separately, you can subtract it here.
        // For now, demo just subtract $4.00 (match your checkout delivery fee)
        discountedTotal = round2(Math.max(0, baseTotal - 4.0));
      } else if (value < 1) {
        // percentage
        discountedTotal = round2(baseTotal * (1 - value));
      } else {
        // flat discount
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

      // ✅ Try to read cart items if you saved them earlier
      // Expected format example:
      // localStorage.setItem("cartItems", JSON.stringify([{name:"Chicken Rice", qty:2, price:4.5}]));
      const cartRaw = localStorage.getItem("cartItems");
      const items = cartRaw ? JSON.parse(cartRaw) : [];

      // If you didn't save items, it still works, just shows empty list on success page.
      // You can change delivery fee if yours differs.
      const deliveryFee = 4.0;
      const subtotalGuess = Math.max(0, discountedTotal - deliveryFee);
      const gst = round2(subtotalGuess * 0.09);

      // ✅ This structure matches the success page JS I gave you earlier
      const lastOrder = {
        items: items.map((i) => ({
          name: i.name || "Item",
          qty: Number(i.qty) || 1,
          price: Number(i.price) || 0,
        })),
        subtotal: subtotalGuess,
        deliveryFee: deliveryFee,
        gst: gst,
        total: discountedTotal,
        paymentMethod: method,
        promoApplied: appliedPromo || null,
        placedAt: new Date().toISOString(),
      };

      localStorage.setItem("lastOrder", JSON.stringify(lastOrder));

      // Optional: also keep your simple summary key
      localStorage.setItem(
        "last_order_summary",
        JSON.stringify({
          paymentMethod: method,
          promoApplied: appliedPromo || null,
          total: discountedTotal,
          placedAt: new Date().toISOString(),
        })
      );

      // ✅ Redirect to your success page
      window.location.href = "c-successful-payment.html"; // change to your actual file
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
