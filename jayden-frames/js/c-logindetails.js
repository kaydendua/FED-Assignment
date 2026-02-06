// js/signup.js
// Works with your Customer Login page HTML (IDs: login-form, login-email, login-password, etc.)

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const emailInput = document.getElementById("login-email");
  const passwordInput = document.getElementById("login-password");

  const signupBtn = document.getElementById("login-signup-btn");
  const guestBtn = document.getElementById("login-guest-btn");

  // Optional: if you want the top right "Log in here ▼" to do something,
  // you can add an id in HTML and handle it here.

  // ---------- Helpers ----------
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function loadCustomers() {
    // Customers should be saved as an array in localStorage key "customers"
    // Example item: { customerId, fullName, email, phone, ... , password? }
    return JSON.parse(localStorage.getItem("customers") || "[]");
  }

  function saveCurrentCustomer(customerObj) {
    localStorage.setItem("currentCustomer", JSON.stringify(customerObj));
  }

  function setGuestSession() {
    const guest = {
      customerId: "GUEST-" + Date.now(),
      fullName: "Guest",
      email: "",
      isGuest: true,
      createdAt: new Date().toISOString()
    };

    saveCurrentCustomer(guest);

    // Optional: guest history stored in browser only
    if (!localStorage.getItem("guestOrderHistory")) {
      localStorage.setItem("guestOrderHistory", JSON.stringify([]));
    }
  }

  function redirectAfterLogin() {
    // Change this to your actual page after login
    // Examples: customer-profile.html, customer-home.html, vendor-list.html
    window.location.href = "customer-profile.html";
  }

  // ---------- Form submit = LOGIN ----------
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    if (!isValidEmail(email)) {
      alert("Please enter a valid email address.");
      emailInput.focus();
      return;
    }

    if (password.length < 1) {
      alert("Please enter your password.");
      passwordInput.focus();
      return;
    }

    const customers = loadCustomers();

    // NOTE:
    // If your signup page did NOT store passwords (best practice),
    // then you can't truly verify password without a backend.
    // For demo, you can either:
    // 1) store a demoPassword at signup, OR
    // 2) allow email-only login.
    //
    // This login supports BOTH:
    // - If customer.password exists, check it
    // - If not, allow email-only login (demo mode)

    const customer = customers.find(c => (c.email || "").toLowerCase() === email);

    if (!customer) {
      alert("Account not found. Please sign up first.");
      return;
    }

    // If password exists in stored record, verify it
    if (customer.password !== undefined) {
      if (customer.password !== password) {
        alert("Incorrect password. Please try again.");
        return;
      }
    } else {
      // Demo mode: no password saved
      // You can remove this block if you DO store passwords
      console.warn("No password stored for this customer. Logging in by email only (demo mode).");
    }

    saveCurrentCustomer({
      ...customer,
      isGuest: false,
      lastLoginAt: new Date().toISOString()
    });

    alert("Login successful!");
    redirectAfterLogin();
  });

  // ---------- Right button: Sign up now! ----------
  signupBtn.addEventListener("click", () => {
    // Change to your actual signup page file name
    window.location.href = "c-signup-questions.html";
  });

  // ---------- Guest ----------
  guestBtn.addEventListener("click", () => {
    setGuestSession();
    alert("Continuing as guest.");
    redirectAfterLogin();
  });

  // ---------- Social buttons (optional demo) ----------
  const appleBtn = document.getElementById("login-social-apple");
  const fbBtn = document.getElementById("login-social-facebook");
  const twitterBtn = document.getElementById("login-social-twitter");

  function socialDemo(provider) {
    alert(`${provider} login is a demo button (not connected).`);
  }

  appleBtn?.addEventListener("click", () => socialDemo("Apple"));
  fbBtn?.addEventListener("click", () => socialDemo("Facebook"));
  twitterBtn?.addEventListener("click", () => socialDemo("Twitter"));
});
