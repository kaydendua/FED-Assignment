// ======================================
// Vendor Login Page JavaScript
// ======================================

document.addEventListener("DOMContentLoaded", () => {

  const menuBtn = document.getElementById("v-login-menu-btn");
  const navLogin = document.getElementById("v-login-nav-login");
  const dropdownContent = document.getElementById("v-login-dropdown-content");
  const navContact = document.getElementById("v-login-nav-contact");

  const form = document.getElementById("v-login-form");
  const emailInput = document.getElementById("v-login-email");
  const passwordInput = document.getElementById("v-login-password");
  const submitBtn = document.getElementById("v-login-submit-btn");
  const signupBtn = document.getElementById("v-login-signup-btn");

  // MENU
  menuBtn.addEventListener("click", () => {
    alert("Menu clicked");
  });

  // LOGIN DROPDOWN TOGGLE
  navLogin.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdownContent.style.display =
      dropdownContent.style.display === "block" ? "none" : "block";
  });

  // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  document.addEventListener("click", () => {
    dropdownContent.style.display = "none";
  });

  // DROPDOWN REDIRECTS
  dropdownContent.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const role = link.textContent.trim();

      if (role === "Customer") {
        window.location.href = "c-logindetails.html";
      } else if (role === "NEA Officer") {
        window.location.href = "../../lixian-pages/loginIn.html";
      }
    });
  });

  // CONTACT
  navContact.addEventListener("click", (e) => {
    e.preventDefault();
    alert("Contact page");
  });

  // SIGN UP
  signupBtn.addEventListener("click", () => {
    window.location.href = "vendor-signup.html";
  });

  // FORM SUBMIT
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!emailInput.value || !passwordInput.value) {
      alert("Please fill in all fields");
      return;
    }

    submitBtn.textContent = "Logging in...";
    submitBtn.disabled = true;

    setTimeout(() => {
      alert("Vendor login successful (mock)");
      submitBtn.textContent = "Login";
      submitBtn.disabled = false;
    }, 1200);
  });
});
