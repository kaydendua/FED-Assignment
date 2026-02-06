// script.js
// Shared script for Customer Hero Page

document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     LOGIN DROPDOWN (TOP NAV)
  ========================= */

  // Find the "Log in here ▼" element
  const navRight = document.querySelector(".nav-right");
  const loginText = navRight?.querySelector("span");

  if (loginText && loginText.textContent.includes("Log in")) {

    // Wrap login text in a container
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
    dropdown.style.background = "#fff";
    dropdown.style.border = "1px solid #ccc";
    dropdown.style.borderRadius = "6px";
    dropdown.style.padding = "6px 0";
    dropdown.style.minWidth = "160px";
    dropdown.style.display = "none";
    dropdown.style.zIndex = "1000";

    dropdown.innerHTML = `
      <div class="login-option" data-role="nea">NEA Officer</div>
      <div class="login-option" data-role="vendor">Vendor</div>
      <div class="login-option" data-role="customer">Customer</div>
    `;

    dropdownWrapper.appendChild(dropdown);

    // Toggle dropdown
    loginText.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.style.display =
        dropdown.style.display === "block" ? "none" : "block";
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", () => {
      dropdown.style.display = "none";
    });

    // Handle option clicks
    dropdown.querySelectorAll(".login-option").forEach(option => {
      option.style.padding = "8px 12px";
      option.style.cursor = "pointer";

      option.addEventListener("mouseenter", () => {
        option.style.background = "#f0f0f0";
      });

      option.addEventListener("mouseleave", () => {
        option.style.background = "transparent";
      });

      option.addEventListener("click", () => {
        const role = option.dataset.role;

        if (role === "nea") {
          window.location.href = "nea-login.html";
        }
        if (role === "vendor") {
          window.location.href = "v-login.html";
        }
        if (role === "customer") {
          window.location.href = "c-logindetails.html";
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
