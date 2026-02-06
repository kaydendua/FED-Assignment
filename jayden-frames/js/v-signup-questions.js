// script.js (Vendor Sign-up multi-step form)

document.addEventListener("DOMContentLoaded", () => {
  // Step sections
  const step1 = document.getElementById("v-signup-step-1");
  const step2 = document.getElementById("v-signup-step-2");
  const step3 = document.getElementById("v-signup-step-3");

  // Step indicator
  const stepIndicator = document.getElementById("v-signup-step-indicator");

  // Buttons
  const next1 = document.getElementById("v-signup-next-1");
  const next2 = document.getElementById("v-signup-next-2");
  const back1 = document.getElementById("v-signup-back-1");
  const back2 = document.getElementById("v-signup-back-2");
  const submit = document.getElementById("v-signup-submit");

  // Inputs
  const firstName = document.getElementById("v-signup-first-name");
  const lastName = document.getElementById("v-signup-last-name");
  const email = document.getElementById("v-signup-email");
  const businessName = document.getElementById("v-signup-business-name");
  const years = document.getElementById("v-signup-years");
  const agree = document.getElementById("v-signup-agree");

  // --- Helpers ---
  function showStep(stepNumber) {
    step1.classList.add("v-signup-hidden");
    step2.classList.add("v-signup-hidden");
    step3.classList.add("v-signup-hidden");

    if (stepNumber === 1) step1.classList.remove("v-signup-hidden");
    if (stepNumber === 2) step2.classList.remove("v-signup-hidden");
    if (stepNumber === 3) step3.classList.remove("v-signup-hidden");

    stepIndicator.textContent = `Step ${stepNumber} of 3`;
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  // --- Step navigation logic ---

  // Step 1 -> Step 2
  next1.addEventListener("click", (e) => {
    e.preventDefault();

    const fn = firstName.value.trim();
    const ln = lastName.value.trim();
    const em = email.value.trim();

    if (fn.length < 1) {
      alert("Please enter your first name.");
      firstName.focus();
      return;
    }

    if (ln.length < 1) {
      alert("Please enter your last name.");
      lastName.focus();
      return;
    }

    if (!isValidEmail(em)) {
      alert("Please enter a valid email.");
      email.focus();
      return;
    }

    showStep(2);
  });

  // Step 2 -> Step 1
  back1.addEventListener("click", (e) => {
    e.preventDefault();
    showStep(1);
  });

  // Step 2 -> Step 3
  next2.addEventListener("click", (e) => {
    e.preventDefault();

    const bn = businessName.value.trim();
    const yrs = years.value.trim();

    if (bn.length < 1) {
      alert("Please enter your business name.");
      businessName.focus();
      return;
    }

    // years optional? If you want required, enforce it:
    if (yrs === "" || Number(yrs) < 0) {
      alert("Please enter a valid number of years in business (0 or more).");
      years.focus();
      return;
    }

    showStep(3);
  });

  // Step 3 -> Step 2
  back2.addEventListener("click", (e) => {
    e.preventDefault();
    showStep(2);
  });

  // Submit
  submit.addEventListener("click", (e) => {
    e.preventDefault();

    if (!agree.checked) {
      alert("You must agree to the terms and conditions.");
      agree.focus();
      return;
    }

    // Build vendor object (demo)
    const vendor = {
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      email: email.value.trim().toLowerCase(),
      businessName: businessName.value.trim(),
      yearsInBusiness: Number(years.value.trim()),
      createdAt: new Date().toISOString()
    };

    // Save to localStorage (demo)
    const vendors = JSON.parse(localStorage.getItem("vendors") || "[]");

    // Check duplicate email
    const exists = vendors.some(v => v.email === vendor.email);
    if (exists) {
      alert("This email is already registered. Please use a different email.");
      return;
    }

    vendors.push(vendor);
    localStorage.setItem("vendors", JSON.stringify(vendors));

    alert("Vendor sign-up successful!");

    // Redirect (change to your real page)
    window.location.href = "vendor-login.html";
  });

  // Initialize on step 1
  showStep(1);
});
