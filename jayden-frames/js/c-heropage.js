// script.js
// Shared script for Customer Hero Page

document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     LOGIN DROPDOWN (TOP NAV)
     Order: Customer → Vendor → Officer
  ========================= */

  // Find the "Log in here ▼" text inside nav-right
  const navRight = document.querySelector(".nav-right");
  const loginText = navRight?.querySelector("span");

  if (loginText && loginText.textContent.includes("Log in")) {

    // Wrap login text in a container (for positioning dropdown)
    const dropdownWrapper = document.createElement("div");
    dropdownWrapper.style.position = "relative";
    dropdownWrapper.style.cursor = "pointer";

    loginText.parentNode.insertBefore(dropdownWrapper, loginText);
    dropdownWrapper.appendChild(loginText);

    // Create dropdown menu
    const dropdown = document.createElement("div");
    dropdown.id = "login-dropdown";
    dropdown.style.position = "absolute";
    dropdown.style.top = "100%";
    dropdown.style.right = "0";
    dropdown.style.background = "#FAF9F9";
    dropdown.style.borderRadius = "10px";
    dropdown.style.padding = "8px 0";
    dropdown.style.minWidth = "180px";
    dropdown.style.display = "none";
    dropdown.style.zIndex = "1000";
    dropdown.style.boxShadow = "2px 2px 6px rgba(40, 88, 123, 0.6)";

    // Dropdown options (ORDER MATTERS)
    dropdown.innerHTML = `
      <div class="login-option" data-role="customer">Customer</div>
      <div class="login-option" data-role="vendor">Vendor</div>
      <div class="login-option" data-role="officer">Officer</div>
    `;

    dropdownWrapper.appendChild(dropdown);

    // Toggle dropdown on click
    loginText.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.style.display =
        dropdown.style.display === "block" ? "none" : "block";
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", () => {
      dropdown.style.display = "none";
    });

    // Handle option hover + click
    dropdown.querySelectorAll(".login-option").forEach(option => {
      option.style.padding = "10px 16px";
      option.style.cursor = "pointer";
      option.style.fontSize = "14px";
      option.style.color = "#1C0F13";

      option.addEventListener("mouseenter", () => {
        option.style.background = "#F6ECF4";
      });

      option.addEventListener("mouseleave", () => {
        option.style.background = "transparent";
      });

      option.addEventListener("click", () => {
        const role = option.dataset.role;

        if (role === "customer") {
          window.location.href = "c-logindetails.html";
        }

        if (role === "vendor") {
          window.location.href = "v-login.html";
        }

        if (role === "officer") {
          window.location.href = "nea-login.html";
        }
      });
    });
  }

  /* =========================
     HERO SIGN-UP BUTTON
  ========================= */

  const signupBtn = document.getElementById("c-hero-signup-btn");

  if (signupBtn) {
    signupBtn.addEventListener("click", () => {
      // Default signup path (customer)
      window.location.href = "customer-signup.html";
    });
  }

});
