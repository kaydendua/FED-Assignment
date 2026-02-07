// ===============================
// Starting Page JavaScript
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const menuIcon = document.getElementById("start-menu-icon");
  const loginDropdown = document.getElementById("start-login-dropdown");
  const dropdownContent = document.getElementById("start-dropdown-content");

  // -------------------------------
  // Menu icon (placeholder)
  // -------------------------------
  menuIcon.addEventListener("click", () => {
    alert("Menu clicked (open navigation / sidebar here)");
  });

  // -------------------------------
  // Login dropdown toggle
  // -------------------------------
  loginDropdown.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent document click from closing it
    const isOpen = dropdownContent.style.display === "block";
    dropdownContent.style.display = isOpen ? "none" : "block";
  });

  // -------------------------------
  // Close dropdown when clicking outside
  // -------------------------------
  document.addEventListener("click", () => {
    dropdownContent.style.display = "none";
  });

  // -------------------------------
  // Optional: handle login role clicks
  // -------------------------------
  const roleLinks = dropdownContent.querySelectorAll("a");

  roleLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const role = link.textContent.trim();
      alert(`Logging in as ${role}...`);

      // Example future redirects:
      // if (role === "Customer") window.location.href = "customer-home.html";
    });
  });
});
