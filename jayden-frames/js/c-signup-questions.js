// js/c-signup-questions.js
// FULL Customer Signup JS (Firebase Auth + Firestore) for your form IDs

import { auth, db } from "/firebase/firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

// ===== DOM =====
const form = document.getElementById("customer-signup-form");

const fullNameInput = document.getElementById("csu-fullname");
const emailInput = document.getElementById("csu-email");
const phoneInput = document.getElementById("csu-phone");
const addressInput = document.getElementById("csu-address");
const postalInput = document.getElementById("csu-postal");
const unitInput = document.getElementById("csu-unit");

const passwordInput = document.getElementById("csu-password");
const confirmInput = document.getElementById("csu-confirm");
const termsCheckbox = document.getElementById("csu-terms");

const alertBox = document.getElementById("customer-signup-alert");
const submitBtn = document.getElementById("customer-signup-submit");

// ===== Helpers =====
function showAlert(type, msg) {
  // type: "success" or "error"
  alertBox.style.display = "block";
  alertBox.className = type;
  alertBox.textContent = msg;
}

function clearAlert() {
  alertBox.style.display = "none";
  alertBox.className = "";
  alertBox.textContent = "";
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidSGPhone(phone) {
  return /^[89]\d{7}$/.test(phone); // 8 digits, start 8 or 9
}

function isValidPostal(postal) {
  return /^\d{6}$/.test(postal);
}

function setLoading(isLoading) {
  if (!submitBtn) return;
  submitBtn.disabled = isLoading;
  submitBtn.textContent = isLoading ? "Creating..." : "Create Account";
}

// Optional: normalize unit format
function normalizeUnit(unit) {
  const u = unit.trim();
  if (!u) return null;
  return u.startsWith("#") ? u : `#${u}`;
}

// ===== Main =====
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearAlert();

  const fullName = fullNameInput.value.trim();
  const email = emailInput.value.trim().toLowerCase();
  const phone = phoneInput.value.trim();
  const address = addressInput.value.trim();
  const postal = postalInput.value.trim();
  const unit = normalizeUnit(unitInput.value);

  const password = passwordInput.value;
  const confirm = confirmInput.value;

  // ----- Frontend validation -----
  if (fullName.length < 2) return showAlert("error", "Please enter your full name.");
  if (!isValidEmail(email)) return showAlert("error", "Please enter a valid email address.");
  if (!isValidSGPhone(phone)) return showAlert("error", "Enter an 8-digit SG phone number starting with 8 or 9.");
  if (address.length < 6) return showAlert("error", "Please enter a valid delivery address.");
  if (!isValidPostal(postal)) return showAlert("error", "Postal code must be 6 digits.");
  if (password.length < 8) return showAlert("error", "Password must be at least 8 characters.");
  if (password !== confirm) return showAlert("error", "Passwords do not match.");
  if (!termsCheckbox.checked) return showAlert("error", "You must agree to the Terms & Conditions.");

  // ----- Firebase signup -----
  try {
    setLoading(true);

    // 1) Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2) Store profile details in Firestore (users/<uid>)
    await setDoc(doc(db, "users", user.uid), {
      role: "customer",
      fullName,
      email,
      phone,
      address,
      postalCode: postal,
      unitNumber: unit,          // null if blank
      createdAt: serverTimestamp(),
      accountStatus: "active"
    });

    showAlert("success", "Account created successfully! Redirecting...");

    setTimeout(() => {
      window.location.href = "customer-profile.html"; // change if needed
    }, 900);

  } catch (error) {
    console.error("Firebase signup error:", error.code, error.message);

    if (error.code === "auth/email-already-in-use") {
      showAlert("error", "This email is already registered. Please log in.");
    } else if (error.code === "auth/weak-password") {
      showAlert("error", "Password is too weak. Use at least 8 characters.");
    } else if (error.code === "auth/invalid-email") {
      showAlert("error", "Invalid email format.");
    } else if (error.code === "auth/operation-not-allowed") {
      showAlert("error", "Email/Password sign-in is not enabled in Firebase Console.");
    } else {
      showAlert("error", "Signup failed. Please try again.");
    }

  } finally {
    setLoading(false);
  }
});
