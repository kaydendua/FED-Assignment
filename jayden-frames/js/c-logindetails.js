// js/c-logindetails.js (MODULE)
// Navbar dropdown + Firebase customer login

import { auth, db,  } from "../../firebase/firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";



console.log("c-logindetails.js loaded ✅");

document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // 1) NAVBAR DROPDOWN (your HTML uses v-login-* IDs)
  // =========================
  const navLogin = document.getElementById("v-login-nav-login");
  const dropdownContent = document.getElementById("v-login-dropdown-content");

  console.log("navLogin found?", !!navLogin);
  console.log("dropdownContent found?", !!dropdownContent);

  if (navLogin && dropdownContent) {
    // start closed (your HTML already has hidden, but we enforce)
    dropdownContent.hidden = true;

    navLogin.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropdownContent.hidden = !dropdownContent.hidden;
    });

    // stop clicks inside dropdown from closing it immediately
    dropdownContent.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    // close when clicking outside
    document.addEventListener("click", () => {
      dropdownContent.hidden = true;
    });

    // redirects (match link text: "Vendor", "NEA Officer")
    dropdownContent.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();

        const roleText = link.textContent.trim().toLowerCase();

        if (roleText.includes("vendor")) {
          window.location.href = "v-login.html";
        } else if (roleText.includes("officer")) {
          window.location.href = "../lixian-pages/loginIn.html";
        } else {
          console.warn("Unknown dropdown option:", link.textContent.trim());
        }

        dropdownContent.hidden = true;
      });
    });
  } else {
    console.warn("Navbar dropdown IDs not found. Check v-login-nav-login / v-login-dropdown-content.");
  }

  // =========================
  // 2) LOGIN FORM (Firebase)
  // =========================
  const form = document.getElementById("login-form");
  const emailInput = document.getElementById("login-email");
  const passwordInput = document.getElementById("login-password");
  const submitBtn = document.getElementById("login-submit");

  if (!form || !emailInput || !passwordInput || !submitBtn) {
    console.error("Login form IDs missing. Check: login-form, login-email, login-password, login-submit.");
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

      // Optional role check (users/{uid}.role must be "customer")
      const snap = await getDoc(doc(db, "users", user.uid));

      if (snap.exists()) {
        const data = snap.data();
        if (data.role && String(data.role).toLowerCase() !== "customer") {
          alert("This is not a customer account.");
          // sign out optional (if you want)
          // await signOut(auth);
          return;
        }
      }

      // ✅ go to your customer page
      window.location.href = "../kayden-pages/search.html";
    } catch (err) {
      console.error("Login error:", err.code, err.message);
      alert(niceError(err.code));
    } finally {
      setLoading(false);
    }
  });
});
