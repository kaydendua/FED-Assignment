// ======================================
// Payment Successful Page JavaScript
// ======================================

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const orderMoreBtn = document.getElementById("checkout-success-order-more-btn");
  const menuBtn = document.getElementById("checkout-success-menu-btn");
  const profileBtn = document.getElementById("checkout-success-profile");

  // -------------------------------
  // Order more button
  // -------------------------------
  orderMoreBtn.addEventListener("click", () => {
    // Replace with real redirect later
    alert("Redirecting you back to restaurants...");
    // window.location.href = "restaurants.html";
  });

  // -------------------------------
  // Menu button (placeholder)
  // -------------------------------
  menuBtn.addEventListener("click", () => {
    alert("Menu clicked (open sidebar / navigation)");
  });

  // -------------------------------
  // Profile button (placeholder)
  // -------------------------------
  profileBtn.addEventListener("click", () => {
    alert("Open profile / account menu");
  });

  // -------------------------------
  // (Optional) Future enhancement
  // Load order details dynamically
  // -------------------------------
  // Example:
  // const orderData = JSON.parse(localStorage.getItem("lastOrder"));
  // if (orderData) {
  //   // Populate items, fees, total here
  // }
});
