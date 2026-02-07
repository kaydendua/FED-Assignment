document.addEventListener("DOMContentLoaded", () => {
  const orderMoreBtn = document.getElementById("checkout-success-order-more-btn");
  const menuBtn = document.getElementById("checkout-success-menu-btn");
  const profileBtn = document.getElementById("checkout-success-profile");

  const listEl = document.getElementById("checkout-success-order-list");
  const deliveryEl = document.getElementById("cs-delivery-fee");
  const gstEl = document.getElementById("cs-gst");
  const totalEl = document.getElementById("checkout-success-total");


    // =========================
  // 40-minute countdown timer
  // =========================
  const timerEl = document.getElementById("cs-timer");
  const timerNoteEl = document.getElementById("cs-timer-note");

  const DURATION_SECONDS = 40 * 60; // 40 minutes

  // Store the start time so refresh won't reset
  const existingStart = localStorage.getItem("deliveryTimerStart");
  const startTime = existingStart ? Number(existingStart) : Date.now();
  if (!existingStart) localStorage.setItem("deliveryTimerStart", String(startTime));

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  function tick() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const remaining = Math.max(0, DURATION_SECONDS - elapsed);

    if (timerEl) timerEl.textContent = formatTime(remaining);

    if (remaining === 0) {
      if (timerNoteEl) timerNoteEl.textContent = "Delivered! Enjoy your meal 🍽️";
      clearInterval(interval);
      // Optional: clear timer so next order restarts
      // localStorage.removeItem("deliveryTimerStart");
    }
  }

  tick();
  const interval = setInterval(tick, 1000);

  // -------------------------------
  // Helper
  // -------------------------------
  function money(n) {
    return `$${Number(n).toFixed(2)}`;
  }

  // -------------------------------
  // Load last order from localStorage
  // -------------------------------
  const lastOrderRaw = localStorage.getItem("lastOrder");

  if (!lastOrderRaw) {
    // No order found (user opened page directly)
    listEl.innerHTML = `<p style="margin:0; color:#555;">No recent order found.</p>`;
    deliveryEl.textContent = "$0.00";
    gstEl.textContent = "$0.00";
    totalEl.textContent = "Total: $0.00";
  } else {
    const lastOrder = JSON.parse(lastOrderRaw);

    // Render items
    listEl.innerHTML = ""; // clear
    if (!lastOrder.items || lastOrder.items.length === 0) {
      listEl.innerHTML = `<p style="margin:0; color:#555;">No items in this order.</p>`;
    } else {
      lastOrder.items.forEach((it, idx) => {
        const row = document.createElement("div");
        row.className = "cs-order-item";
        row.id = `checkout-success-item-${idx + 1}`;
        row.innerHTML = `
          <span class="cs-qty">${it.qty}x</span>
          <span class="cs-name">${it.name}</span>
          <span class="cs-price">${money(it.price * it.qty)}</span>
        `;
        listEl.appendChild(row);
      });
    }

    // Fees + totals
    deliveryEl.textContent = money(lastOrder.deliveryFee || 0);
    gstEl.textContent = money(lastOrder.gst || 0);

    const total = (lastOrder.subtotal || 0) + (lastOrder.deliveryFee || 0) + (lastOrder.gst || 0);
    totalEl.textContent = `Total: ${money(total)}`;
  }

  // -------------------------------
  // Buttons
  // -------------------------------
  orderMoreBtn.addEventListener("click", () => {
    // Clear last order if you want
    localStorage.removeItem("lastOrder");
    // Redirect back to your home / restaurant page
    window.location.href = "restaurants.html"; // change to your real page
  });

  menuBtn.addEventListener("click", () => {
    alert("Menu clicked (open sidebar / navigation)");
  });

  profileBtn.addEventListener("click", () => {
    alert("Open profile / account menu");
  });
});
