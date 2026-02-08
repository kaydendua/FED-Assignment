// ===============================
// Checkout Page JavaScript
// ===============================

document.addEventListener("DOMContentLoaded", () => {

  // ===============================
  // ELEMENTS
  // ===============================
  const placeOrderBtn = document.getElementById("co-place-order-btn");
  const addressInput = document.getElementById("co-address");
  const addressDetailInput = document.getElementById("co-address-detail");
  const totalPriceText = document.getElementById("co-total-price");

  const menuBtn = document.querySelector(".menu-btn");
  const avatarBtn = document.getElementById("co-avatar");

  // Summary elements (make sure these IDs exist in HTML)
  const itemsContainer = document.getElementById("co-items");
  const subtotalText = document.getElementById("co-subtotal");
  const gstText = document.getElementById("co-gst");
  const finalTotalText = document.getElementById("co-total-final");

  // ===============================
  // CONSTANTS
  // ===============================
  const DELIVERY_FEE = 4.00;
  const GST_RATE = 0.09;

  // ===============================
  // LOAD CART
  // ===============================
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    alert("Your cart is empty.");
    placeOrderBtn.disabled = true;
    return;
  }

  // ===============================
  // RENDER ORDER ITEMS
  // ===============================
  let subtotal = 0;

  cart.forEach(item => {
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;

    const row = document.createElement("div");
    row.className = "co-item";
    row.innerHTML = `
      <span class="co-item-name">
        ${item.qty}× ${item.name}
      </span>
      <span class="co-item-price">
        $${itemTotal.toFixed(2)}
      </span>
    `;
    itemsContainer.appendChild(row);
  });

  // ===============================
  // CALCULATIONS
  // ===============================
  const gstAmount = subtotal * GST_RATE;
  const finalTotal = subtotal + DELIVERY_FEE + gstAmount;

  subtotalText.textContent = `$${subtotal.toFixed(2)}`;
  gstText.textContent = `$${gstAmount.toFixed(2)}`;
  finalTotalText.textContent = `$${finalTotal.toFixed(2)}`;
  totalPriceText.textContent = `$${finalTotal.toFixed(2)}`;

  placeOrderBtn.addEventListener("click", () => {
  const address = addressInput.value.trim();
  const addressDetail = addressDetailInput.value.trim();

  if (!address || !addressDetail) {
    alert("Please fill in your delivery address details.");
    return;
  }

  // ✅ Save cart in the key your payment page expects
  localStorage.setItem("cartItems", JSON.stringify(cart));

  // ✅ Save total for payment page
  const total = document.getElementById("co-total-final").innerText;
  localStorage.setItem("checkoutTotal", total);

  // ✅ Save delivery details (optional but useful for Firestore order)
  localStorage.setItem("deliveryAddress", JSON.stringify({
    address,
    addressDetail
  }));

  // ✅ Go to payment page
  window.location.href = "c-payment.html";
});


  // ===============================
  // NAV PLACEHOLDERS
  // ===============================
  menuBtn.addEventListener("click", () => {
    alert("Menu clicked (open sidebar here)");
  });

  avatarBtn.addEventListener("click", (e) => {
    e.preventDefault();
    alert("Profile / account menu");
  });
});
