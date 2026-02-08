// js/v-login.js (MODULE)
// Vendor login via Firestore ONLY (no Firebase Auth)
// Firebase logic is UNCHANGED — dropdown logic FIXED ONLY

import { db } from "../../firebase/firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

console.log("v-login.js loaded ✅");

document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // NAVBAR DROPDOWN (FIXED)
  // =========================
  const navWrapper = document.getElementById("v-login-nav-login");
  const navTrigger = navWrapper?.querySelector(".nav-link");
  const dropdown = document.getElementById("v-login-dropdown-content");

  if (navWrapper && navTrigger && dropdown) {
    // start closed
    dropdown.hidden = true;

    navTrigger.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropdown.hidden = !dropdown.hidden;
    });

    // keep open when clicking inside
    dropdown.addEventListener("click", (e) => e.stopPropagation());

    // close when clicking outside
    document.addEventListener("click", () => {
      dropdown.hidden = true;
    });

    // dropdown navigation
    dropdown.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();

        const roleText = link.textContent.trim().toLowerCase();

        if (roleText.includes("customer")) {
          window.location.href = "c-logindetails.html";
        } else if (roleText.includes("officer")) {
          window.location.href = "../lixian-pages/loginIn.html";
        }

        dropdown.hidden = true;
      });
    });
  } else {
    console.warn("Dropdown elements missing (v-login-nav-login / v-login-dropdown-content)");
  }

  // =========================
  // VENDOR LOGIN (UNCHANGED)
  // =========================
  const VENDOR_COLLECTION = "vendor";
  const EMAIL_FIELD = "email";
  const PASSWORD_FIELD = "password";

  const form = document.getElementById("v-login-form");
  const emailInput = document.getElementById("v-login-email");
  const passwordInput = document.getElementById("v-login-password");
  const submitBtn = document.getElementById("v-login-submit-btn");

  if (!form || !emailInput || !passwordInput || !submitBtn) {
    console.error("Vendor login IDs missing.");
    return;
  }

  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    submitBtn.textContent = isLoading ? "Logging in..." : "Login";
  }

  function normalizeEmail(v) {
    return (v || "").trim().toLowerCase();
  }

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

      const snap = await getDocs(collection(db, VENDOR_COLLECTION));
      let found = null;

      snap.forEach((docSnap) => {
        const data = docSnap.data();
        const storedEmail = normalizeEmail(data[EMAIL_FIELD]);
        const storedPassword = (data[PASSWORD_FIELD] || "").trim();

        if (storedEmail === inputEmail) {
          found = { id: docSnap.id, data, storedPassword };
        }
      });

      if (!found) {
        alert("Vendor not found.");
        return;
      }

      if (found.storedPassword !== inputPassword) {
        alert("Wrong password.");
        return;
      }

      // save session (UNCHANGED)
      localStorage.setItem("vendorId", found.id);
      localStorage.setItem("vendorEmail", found.data[EMAIL_FIELD] || inputEmail);
      localStorage.setItem("vendorName", found.data.name || "");

      alert("Login successful!");

      window.location.href = "../../liangcheng-pages/StallManagement.html";

    } catch (err) {
      console.error("Vendor login error:", err);
      alert("Login error. Check console.");
    } finally {
      setLoading(false);
    }
  });
});
