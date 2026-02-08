// ===============================
// Starting Page JavaScript (FIXED)
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  const menuIcon = document.getElementById("start-menu-icon");
  const loginDropdown = document.getElementById("start-login-dropdown");
  const dropdownContent = document.getElementById("start-dropdown-content");

  if (!menuIcon || !loginDropdown || !dropdownContent) {
    console.error("Missing element(s): check your IDs in the HTML.");
    return;
  }

  // Menu icon (placeholder)
  menuIcon.addEventListener("click", () => {
    alert("Menu clicked (open navigation / sidebar here)");
  });

  // Toggle dropdown (use hidden instead of style.display)
  dropdownContent.hidden = true;

  loginDropdown.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdownContent.hidden = !dropdownContent.hidden;
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", () => {
    dropdownContent.hidden = true;
  });

  // Prevent clicks inside menu from closing before link click
  dropdownContent.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // Handle login role redirects (match your real link text)
  dropdownContent.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const roleText = link.textContent.trim().toLowerCase();

      if (roleText.includes("customer")) {
        window.location.href = "c-logindetails.html";
      } else if (roleText.includes("vendor")) {
        window.location.href = "v-login.html";
      } else if (roleText.includes("officer")) {
        window.location.href = "../../lixian-pages/loginIn.html";
      } else {
        console.warn("Unknown role clicked:", link.textContent.trim());
      }

      // close after click
      dropdownContent.hidden = true;
    });
  });
});
