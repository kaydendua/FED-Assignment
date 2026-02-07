// ======================================
// Vendor Signup Hero Page (v-signup-hero.js)
// ======================================

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const menuBtn = document.getElementById("v-hero-menu-btn");
  const loginDropdownTrigger = document.getElementById("v-hero-login-dropdown");
  const contactLink = document.getElementById("v-hero-contact-link");
  const applyBtn = document.getElementById("v-hero-apply-btn");

  // Create dropdown content dynamically (since HTML only has the trigger text)
  const dropdownMenu = document.createElement("div");
  dropdownMenu.id = "v-hero-dropdown-content";
  dropdownMenu.style.display = "none";
  dropdownMenu.style.position = "absolute";
  dropdownMenu.style.top = "100%";
  dropdownMenu.style.right = "0";
  dropdownMenu.style.zIndex = "999";

  dropdownMenu.innerHTML = `
    <a href="#" data-role="Vendor">Vendor</a>
    <a href="#" data-role="NEA Officer">NEA Officer</a>
    <a href="#" data-role="Customer">Customer</a>
  `;

  // Wrap trigger in a positioned container so dropdown can sit under it
  const wrapper = document.createElement("span");
  wrapper.style.position = "relative";
  wrapper.style.display = "inline-block";

  // Replace trigger in DOM with wrapper → trigger + dropdown
  loginDropdownTrigger.parentNode.insertBefore(wrapper, loginDropdownTrigger);
  wrapper.appendChild(loginDropdownTrigger);
  wrapper.appendChild(dropdownMenu);

  // -------------------------------
  // Menu button (placeholder)
  // -------------------------------
  menuBtn.addEventListener("click", () => {
    alert("Menu clicked (open sidebar / navigation here)");
  });

  // -------------------------------
  // Contact link (placeholder)
  // -------------------------------
  contactLink.addEventListener("click", (e) => {
    e.preventDefault();
    alert("Contact us clicked (go to contact page here)");
    // window.location.href = "contact.html";
  });

  // -------------------------------
  // Login dropdown toggle
  // -------------------------------
  loginDropdownTrigger.style.cursor = "pointer";

  loginDropdownTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = dropdownMenu.style.display === "block";
    dropdownMenu.style.display = isOpen ? "none" : "block";
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", () => {
    dropdownMenu.style.display = "none";
  });

  // Prevent closing when clicking inside menu
  dropdownMenu.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // Handle role clicks
  dropdownMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const role = link.dataset.role;

      alert(`Selected: ${role} login (redirect here)`);

      // Example redirects (replace with your real pages):
      // if (role === "Vendor") window.location.href = "vendor-login.html";
      // if (role === "Customer") window.location.href = "customer-login.html";
      // if (role === "NEA Officer") window.location.href = "nea-login.html";

      dropdownMenu.style.display = "none";
    });
  });

  // -------------------------------
  // Apply button: enable after a short check
  // -------------------------------
  // Starts disabled in your HTML; we enable it after a small delay
  applyBtn.textContent = "Checking availability...";
  applyBtn.disabled = true;

  setTimeout(() => {
    applyBtn.disabled = false;
    applyBtn.textContent = "Apply now!";
  }, 900);

  // Apply button click
  applyBtn.addEventListener("click", () => {
    alert("Proceeding to Vendor Application form...");
    // window.location.href = "vendor-application.html";
  });
});
