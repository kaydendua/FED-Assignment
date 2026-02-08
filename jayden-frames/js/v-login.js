// js/v-login.js (MODULE)
// Vendor login via Firestore ONLY (no Firebase Auth)
// Uses email + password fields stored in Firestore vendor collection

import { db } from "../../firebase/firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

console.log("v-login.js loaded ✅");

document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // CONFIG (change if needed)
  // =========================
  const VENDOR_COLLECTION = "vendor";
  const EMAIL_FIELD = "email";
  const PASSWORD_FIELD = "password";

  // =========================
  // NAVBAR DROPDOWN (optional)
  // =========================
  const navLogin = document.getElementById("v-login-nav-login");
  const dropdownContent = document.getElementById("v-login-dropdown-content");

  if (navLogin && dropdownContent) {
    navLogin.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdownContent.style.display =
        dropdownContent.style.display === "block" ? "none" : "block";
    });

    dropdownContent.addEventListener("click", (e) => e.stopPropagation());

    document.addEventListener("click", () => {
      dropdownContent.style.display = "none";
    });

    dropdownContent.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const role = link.textContent.trim();

        if (role === "Customer") window.location.href = "c-logindetails.html";
        if (role === "NEA Officer") window.location.href = "../lixian-pages/loginIn.html";
      });
    });
  }

  // =========================
  // FORM
  // =========================
  const form = document.getElementById("v-login-form");
  const emailInput = document.getElementById("v-login-email");
  const passwordInput = document.getElementById("v-login-password");
  const submitBtn = document.getElementById("v-login-submit-btn");

  if (!form || !emailInput || !passwordInput || !submitBtn) {
    console.error("Vendor login IDs missing. Need v-login-form, v-login-email, v-login-password, v-login-submit-btn");
    return;
  }

  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    submitBtn.textContent = isLoading ? "Logging in..." : "Login";
  }

  function normalizeEmail(v) {
    return (v || "").trim().toLowerCase();
  }

  // Optional: auto-redirect if already “logged in”
  const existingVendorId = localStorage.getItem("vendorId");
  if (existingVendorId) {
    console.log("Vendor already logged in:", existingVendorId);
    // window.location.href = "vendor-dashboard.html"; // uncomment if you want auto-redirect
  }

  // =========================
  // LOGIN LOGIC (Firestore)
  // =========================
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const inputEmail = normalizeEmail(emailInput.value);
    const inputPassword = (passwordInput.value || "").trim();

    if (!inputEmail || !inputPassword) {
      alert("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      // 1) Get all vendors (assignment-size friendly)
      const snap = await getDocs(collection(db, VENDOR_COLLECTION));
      console.log("Vendor docs count =", snap.size);

      let found = null;

      snap.forEach((docSnap) => {
        const data = docSnap.data();

        const storedEmail = normalizeEmail(data[EMAIL_FIELD]);
        const storedPassword = (data[PASSWORD_FIELD] || "").trim();

        if (!storedEmail) return;

        if (storedEmail === inputEmail) {
          found = { id: docSnap.id, data, storedPassword };
        }
      });

      // 2) Not found
      if (!found) {
        alert("Vendor not found. (Email does not match any vendor record)");
        return;
      }

      // 3) Password check
      if ((found.storedPassword || "") !== inputPassword) {
        alert("Wrong password.");
        return;
      }

      // 4) Save “session”
      localStorage.setItem("vendorId", found.id);
      localStorage.setItem("vendorEmail", found.data[EMAIL_FIELD] || inputEmail);
      localStorage.setItem("vendorName", found.data.name || found.data.Name || "");

      alert("Login successful!");

      // 5) Redirect
      window.location.href = "../../liangcheng-pages/StallManagement.html"; // <-- change to your vendor page

    } catch (err) {
      console.error("Vendor Firestore login error:", err);

      // If rules block reads, you will see this:
      // FirebaseError: Missing or insufficient permissions
      alert("Login error. Check console (possible Firestore rules / wrong project / path).");
    } finally {
      setLoading(false);
    }
  });
});

  document.addEventListener("DOMContentLoaded", () => {
    const wrapper = document.getElementById("v-login-nav-login");
    const trigger = wrapper?.querySelector(".nav-link");
    const menu = document.getElementById("v-login-dropdown-content");

    if (!wrapper || !trigger || !menu) return;

    // Ensure starts hidden
    menu.hidden = true;

    const openMenu = () => { menu.hidden = false; };
    const closeMenu = () => { menu.hidden = true; };
    const toggleMenu = () => { menu.hidden = !menu.hidden; };

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Stop clicks inside menu from closing immediately
    menu.addEventListener("click", (e) => e.stopPropagation());

    // Click outside closes
    document.addEventListener("click", closeMenu);

    // ESC closes
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  });