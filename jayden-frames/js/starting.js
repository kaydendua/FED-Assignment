// ===============================
// Starting Page JavaScript
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  const menuIcon = document.getElementById("start-menu-icon");
  const loginDropdown = document.getElementById("start-login-dropdown");
  const dropdownContent = document.getElementById("start-dropdown-content");

  // Safety check (prevents errors if IDs are missing)
  if (!menuIcon || !loginDropdown || !dropdownContent) {
    console.error("Missing element(s): check your IDs in the HTML.");
    return;
  }

  // Menu icon (placeholder)
  menuIcon.addEventListener("click", () => {
    alert("Menu clicked (open navigation / sidebar here)");
  });

  // Login dropdown toggle
  loginDropdown.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = dropdownContent.style.display === "block";
    dropdownContent.style.display = isOpen ? "none" : "block";
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", () => {
    dropdownContent.style.display = "none";
  });

  // Handle login role redirects
  const roleLinks = dropdownContent.querySelectorAll("a");

  roleLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const role = link.textContent.trim();

      if (role === "Customer") {
        window.location.href = "c-logindetails.html";
      } else if (role === "Vendor") {
        window.location.href = "v-login.html";
      } else if (role === "NEA Officer") {
        window.location.href = "../../lixian-pages/loginIn.html";
      } else {
        console.warn("Unknown role clicked:", role);
      }
    });
  });
});
