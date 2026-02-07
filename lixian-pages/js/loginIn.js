// ../lixian-pages/js/loginIn.js (MODULE)
// NEA Officer Login (Firestore-only) + dropdown + show/hide password
// Robust version: scans NEA collection and compares normalized email (prevents "not found" due to case/spaces)

import { db } from "../../firebase/firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

console.log("loginIn.js loaded ✅");

document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // CONFIG (edit if your names differ)
  // =========================
  const NEA_COLLECTION = "NEA";   // 🔥 if your collection is "NEA officer", change to "NEA officer"
  const EMAIL_FIELD = "email";
  const PASSWORD_FIELD = "password";

  // =========================
  // Dropdown menu (header)
  // =========================
  const loginMenuBtn = document.getElementById("loginMenuBtn");
  const loginMenu = document.getElementById("loginMenu");

  if (loginMenuBtn && loginMenu) {
    loginMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      loginMenu.hidden = !loginMenu.hidden;
    });

    loginMenu.addEventListener("click", (e) => e.stopPropagation());

    document.addEventListener("click", () => {
      loginMenu.hidden = true;
    });

    // Optional redirects (edit paths if needed)
    const links = loginMenu.querySelectorAll("a");
    if (links.length >= 3) {
      links[0].addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "../../jayden-frames/c-logindetails.html";
      });
      links[1].addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "../../jayden-frames/v-login.html";
      });
      links[2].addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "../lixian-pages/loginIn.html";
      });
    }
  }

  // =========================
  // Toggle show/hide password
  // =========================
  const passwordInput = document.getElementById("password");
  const togglePasswordBtn = document.getElementById("togglePassword");

  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener("click", () => {
      const show = passwordInput.type === "password";
      passwordInput.type = show ? "text" : "password";
      togglePasswordBtn.textContent = show ? "Hide" : "Show";
    });
  }

  // =========================
  // Login (Firestore)
  // =========================
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const loginBtn = document.getElementById("loginBtn");
  const rememberMe = document.getElementById("rememberMe");

  if (!loginForm || !emailInput || !passwordInput || !loginBtn) {
    console.error("Missing IDs: loginForm / email / password / loginBtn");
    return;
  }

  function setLoading(isLoading) {
    loginBtn.disabled = isLoading;
    loginBtn.textContent = isLoading ? "Logging in..." : "Log In";
  }

  function norm(v) {
    return (v || "").trim().toLowerCase();
  }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const inputEmail = norm(emailInput.value);
    const inputPassword = (passwordInput.value || "").trim();
    const useRemember = !!rememberMe?.checked;

    if (!inputEmail || !inputPassword) {
      alert("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      // 1) Read all NEA docs (robust for assignment-sized data)
      const snap = await getDocs(collection(db, NEA_COLLECTION));
      console.log("NEA docs count:", snap.size);

      let found = null;

      snap.forEach((docSnap) => {
        const data = docSnap.data();

        const storedEmail = norm(data[EMAIL_FIELD]);
        if (!storedEmail) return;

        if (storedEmail === inputEmail) {
          found = { id: docSnap.id, data };
        }
      });

      // 2) Not found
      if (!found) {
        alert("Account does not exist (email not found).");
        return;
      }

      // 3) Password check
      const storedPassword = (found.data[PASSWORD_FIELD] || "").trim();
      if (storedPassword !== inputPassword) {
        alert("Wrong password.");
        return;
      }

      // 4) Save session
      const storage = useRemember ? localStorage : sessionStorage;
      storage.setItem("neaDocId", found.id);
      storage.setItem("neaEmail", found.data[EMAIL_FIELD] || inputEmail);
      storage.setItem("neaOfficerId", found.data.officerid || found.data.officerId || "");

      // Clear the other storage to avoid confusion
      (useRemember ? sessionStorage : localStorage).removeItem("neaDocId");
      (useRemember ? sessionStorage : localStorage).removeItem("neaEmail");
      (useRemember ? sessionStorage : localStorage).removeItem("neaOfficerId");

      // 5) Redirect
      window.location.href = "../lixian-pages/main-page.html";

    } catch (err) {
      console.error("NEA login error:", err);

      if (err?.code === "permission-denied") {
        alert("Permission denied. Your Firestore rules still block reading the NEA collection.");
      } else {
        alert("Login error. Check console.");
      }
    } finally {
      setLoading(false);
    }
  });
});
