// js/c-logindetails.js (MODULE)
// Dropdown + Firebase login

import { auth, db } from "../../firebase/firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

console.log("c-logindetails.js loaded ✅");

document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // NAVBAR DROPDOWN
  // =========================
  const navLogin = document.getElementById("c-login-nav-login");
  const dropdownContent = document.getElementById("c-login-dropdown-content");

  console.log("navLogin found?", !!navLogin);
  console.log("dropdownContent found?", !!dropdownContent);

  if (navLogin && dropdownContent) {
    navLogin.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdownContent.style.display =
        dropdownContent.style.display === "block" ? "none" : "block";
    });

    // IMPORTANT: stop clicks inside dropdown from closing it instantly
    dropdownContent.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    // Close when clicking outside
    document.addEventListener("click", () => {
      dropdownContent.style.display = "none";
    });

    // Redirects
    dropdownContent.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const role = link.textContent.trim();

        if (role === "Vendor") window.location.href = "v-login.html";
        if (role === "NEA Officer") window.location.href = "../lixian-pages/loginIn.html";
      });
    });
  }

  // =========================
  // LOGIN FORM (Firebase)
  // =========================
  const form = document.getElementById("login-form");
  const emailInput = document.getElementById("login-email");
  const passwordInput = document.getElementById("login-password");
  const submitBtn = document.getElementById("login-submit");

  if (!form || !emailInput || !passwordInput || !submitBtn) {
    console.error("Login form IDs missing.");
    return;
  }

  function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    submitBtn.textContent = isLoading ? "Logging in..." : "Log in!";
  }

  function niceError(code) {
    if (code === "auth/invalid-credential") return "Wrong email or password.";
    if (code === "auth/invalid-email") return "Please enter a valid email.";
    if (code === "auth/too-many-requests") return "Too many attempts. Try again later.";
    if (code === "auth/network-request-failed") return "Network error. Try again.";
    return "Login failed. Please try again.";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const cred = await signInWithEmailAndPassword(auth, email, password);
      const user = cred.user;

      // Optional role check
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        const data = snap.data();
        if (data.role && data.role !== "customer") {
          alert("This is not a customer account.");
          return;
        }
      }

      window.location.href = "../kayden-pages/search.html";

    } catch (err) {
      console.error("Login error:", err.code, err.message);
      alert(niceError(err.code));
    } finally {
      setLoading(false);
    }
  });
});
