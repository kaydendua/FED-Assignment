// ======================================
// Vendor Login Page JavaScript (v-login.js)
// ======================================

document.addEventListener("DOMContentLoaded", () => {
  // Navbar elements
  const menuBtn = document.getElementById("v-login-menu-btn");
  const navLogin = document.getElementById("v-login-nav-login");
  const navContact = document.getElementById("v-login-nav-contact");

  // Form elements
  const form = document.getElementById("v-login-form");
  const emailInput = document.getElementById("v-login-email");
  const passwordInput = document.getElementById("v-login-password");
  const submitBtn = document.getElementById("v-login-submit-btn");

  // Side action
  const signupBtn = document.getElementById("v-login-signup-btn");

  // -------------------------------
  // Menu button (placeholder)
  // -------------------------------
  menuBtn.addEventListener("click", () => {
    alert("Menu clicked (open sidebar / navigation here)");
  });

  // -------------------------------
  // Navbar links (placeholder behavior)
  // -------------------------------
  navLogin.addEventListener("click", (e) => {
    e.preventDefault();
    // Focus email field to simulate "go to login"
    emailInput.focus();
  });

  navContact.addEventListener("click", (e) => {
    e.preventDefault();
    alert("Contact us clicked (redirect to contact page here)");
    // window.location.href = "contact.html";
  });

  // -------------------------------
  // Sign up button
  // -------------------------------
  signupBtn.addEventListener("click", () => {
    alert("Redirecting to Vendor Sign Up...");
    // window.location.href = "vendor-signup.html";
  });

  // -------------------------------
  // Form submit (basic validation + mock login)
  // -------------------------------
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Basic checks
    if (!email) {
      alert("Please enter your email.");
      emailInput.focus();
      return;
    }

    if (!isValidEmail(email)) {
      alert("Please enter a valid email address.");
      emailInput.focus();
      return;
    }

    if (!password) {
      alert("Please enter your password.");
      passwordInput.focus();
      return;
    }

    if (password.length < 6) {
      alert("Password should be at least 6 characters.");
      passwordInput.focus();
      return;
    }

    // Mock loading state
    submitBtn.disabled = true;
    const oldText = submitBtn.textContent;
    submitBtn.textContent = "Logging in...";

    // Simulate request
    setTimeout(() => {
      alert("Login successful! (Mock)");

      // Example: go to vendor dashboard
      // window.location.href = "vendor-dashboard.html";

      submitBtn.disabled = false;
      submitBtn.textContent = oldText;
    }, 1200);
  });

  // -------------------------------
  // Helpers
  // -------------------------------
  function isValidEmail(email) {
    // Simple email pattern (good enough for front-end validation)
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
});
