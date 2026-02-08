// ../jayden-frames/js/c-profile.js (MODULE)
// Loads customer profile from Firestore: users/{uid}

import { db } from "../../firebase/firebase.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // Helpers
  // =========================
  const $ = (id) => document.getElementById(id);

  function safeText(v, fallback = "—") {
    if (v === undefined || v === null || v === "") return fallback;
    return String(v);
  }

  function formatCreatedAt(createdAt) {
    // Firestore Timestamp has toDate()
    try {
      if (!createdAt) return "—";
      if (typeof createdAt.toDate === "function") {
        return createdAt.toDate().toLocaleString();
      }
      // if stored as string already
      return String(createdAt);
    } catch {
      return "—";
    }
  }

  function setText(id, value, fallback = "—") {
    const el = $(id);
    if (!el) return;
    el.textContent = safeText(value, fallback);
  }

  // =========================
  // 1) TOP NAV: Menu toggle
  // =========================
  const menuBtn = document.querySelector(".menu-btn");
  const navbar = document.querySelector(".navbar");

  if (navbar) {
    const dropdown = document.createElement("div");
    dropdown.className = "menu-dropdown";
    dropdown.hidden = true;
    dropdown.innerHTML = `
      <a href="#" data-go="home">Home</a>
      <a href="#" data-go="for-you">For You</a>
      <a href="#" data-go="search">Search</a>
      <a href="#" data-go="points">Points</a>
      <a href="#" data-go="profile">Profile</a>
    `;
    navbar.appendChild(dropdown);

    menuBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.hidden = !dropdown.hidden;
    });

    document.addEventListener("click", () => {
      dropdown.hidden = true;
    });

    dropdown.addEventListener("click", (e) => e.stopPropagation());

    dropdown.querySelectorAll("a[data-go]").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const target = link.dataset.go;

        // ✅ Update these routes to your real pages
        const routes = {
          home: "../kayden-pages/home.html",
          "for-you": "../kayden-pages/forYou.html",
          search: "../kayden-pages/search.html",
          points: "../kayden-pages/points.html",
          profile: "../kayden-pages/customerProfile.html",
        };

        if (routes[target]) window.location.href = routes[target];
      });
    });
  }

  // =========================
  // 2) NAV LINKS: active link
  // =========================
  const navLinks = document.querySelectorAll(".nav-right .nav-link");
  navLinks.forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      navLinks.forEach((x) => x.classList.remove("active"));
      a.classList.add("active");
    });
  });

  // =========================
  // 3) PROFILE IMAGES: click small -> update big
  // =========================
  const bigImg = document.getElementById("profile-main-photo");
  const thumbs = document.querySelectorAll(".profile-thumb");

  thumbs.forEach((t) => {
    t.addEventListener("click", () => {
      if (!bigImg) return;
      bigImg.src = t.src;
    });
  });

  // =========================
  // 4) Order button navigation
  // =========================
  const orderBtn = $("profile-order-btn");
  orderBtn?.addEventListener("click", () => {
    // ✅ Set to your customer browse page / ordering start page
    window.location.href = "../kayden-pages/browseStalls.html";
  });

  // Optional edit profile button (if exists)
  const editBtn = $("profile-edit-btn");
  editBtn?.addEventListener("click", () => {
    // ✅ Change to your edit profile page if you have one
    window.location.href = "../kayden-pages/editProfile.html";
  });

  // =========================
  // 5) Load profile from Firebase
  // =========================
  const auth = getAuth();

  // Show loading placeholders
  setText("profile-username", "Loading...");
  setText("profile-desc", "Loading your details...");

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      // Not logged in
      setText("profile-username", "Not logged in");
      setText("profile-desc", "Please log in to view your profile.");
      setText("profile-status", "—");
      setText("profile-role", "—");
      setText("profile-email", "—");
      setText("profile-phone", "—");
      setText("profile-address", "—");
      setText("profile-unit", "—");
      setText("profile-postal", "—");
      setText("profile-createdAt", "—");
      return;
    }

    try {
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        setText("profile-username", "Profile not found");
        setText("profile-desc", "No user document found in Firestore.");
        return;
      }

      const data = snap.data();

      // Main name
      setText("profile-username", data.fullName || data.name || "Customer");

      // Optional description
      const status = safeText(data.accountStatus, "active");
      const role = safeText(data.role, "customer");
      setText(
        "profile-desc",
        `Account: ${status} • Role: ${role}`
      );

      // Fill details
      setText("profile-status", data.accountStatus);
      setText("profile-role", data.role);
      setText("profile-email", data.email);
      setText("profile-phone", data.phone);

      setText("profile-address", data.address);
      setText("profile-unit", data.unitNumber);
      setText("profile-postal", data.postalCode);

      setText("profile-createdAt", formatCreatedAt(data.createdAt));

      // If you later add profile photo URL in Firestore (e.g. data.photoUrl)
      // you can set it here:
      // if (data.photoUrl && bigImg) bigImg.src = data.photoUrl;

    } catch (err) {
      console.error("Failed to load user profile:", err);
      setText("profile-username", "Error loading profile");
      setText("profile-desc", "Check console for details.");
    }
  });
});
