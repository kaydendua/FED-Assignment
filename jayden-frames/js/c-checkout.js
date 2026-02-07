// ===============================
// Checkout Page JavaScript
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const placeOrderBtn = document.getElementById("co-place-order-btn");
  const addressInput = document.getElementById("co-address");
  const addressDetailInput = document.getElementById("co-address-detail");
  const totalPrice = document.getElementById("co-total-price");

  const menuBtn = document.querySelector(".menu-btn");
  const avatarBtn = document.getElementById("co-avatar");

  // -------------------------------
  // Place Order button logic
  // -------------------------------
  placeOrderBtn.addEventListener("click", () => {
    const address = addressInput.value.trim();
    const addressDetail = addressDetailInput.value.trim();

    // Basic validation
    if (!address || !addressDetail) {
      alert("Please fill in your delivery address details.");
      return;
    }

    // Disable button while processing
    placeOrderBtn.disabled = true;
    placeOrderBtn.textContent = "Placing order...";

    // Simulate backend request
    setTimeout(() => {
      alert(
        `Order placed successfully!\n\n` +
        `Delivery to:\n${address}\n\n` +
        `Total paid: ${totalPrice.textContent}`
      );

      // Reset button (or redirect to confirmation page)
      placeOrderBtn.textContent = "Order placed ✓";
    }, 1500);
  });

  // -------------------------------
  // Menu button (placeholder)
  // -------------------------------
  menuBtn.addEventListener("click", () => {
    alert("Menu clicked (open sidebar / drawer here)");
  });

  // -------------------------------
  // Avatar button (placeholder)
  // -------------------------------
  avatarBtn.addEventListener("click", (e) => {
    e.preventDefault();
    alert("Profile / account menu");
  });
});
