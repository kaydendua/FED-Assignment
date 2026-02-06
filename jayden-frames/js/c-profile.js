document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // 1) TOP NAV: Menu toggle
  // =========================
  const menuBtn = document.querySelector(".menu-btn");
  const navbar = document.querySelector(".navbar");

  // Create a simple dropdown menu (since HTML doesn't include one)
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

  if (menuBtn) {
    menuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.hidden = !dropdown.hidden;
    });
  }

  // Close dropdown when clicking outside
  document.addEventListener("click", () => {
    dropdown.hidden = true;
  });

  // Stop clicks inside dropdown from closing it immediately
  dropdown.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // Demo navigation for dropdown items
  dropdown.querySelectorAll("a[data-go]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = link.dataset.go;

      // Change these to your real page paths
      const routes = {
        home: "../pages/home.html",
        "for-you": "../pages/for-you.html",
        search: "../pages/search.html",
        points: "../pages/points.html",
        profile: "../pages/profile.html",
      };

      if (routes[target]) window.location.href = routes[target];
    });
  });

  // =========================
  // 2) NAV LINKS: active link
  // =========================
  const navLinks = document.querySelectorAll(".nav-right .nav-link");
  navLinks.forEach((a) => {
    a.addEventListener("click", (e) => {
      // Your current HTML uses href="#", so prevent jumping to top
      e.preventDefault();

      // Visually set active
      navLinks.forEach((x) => x.classList.remove("active"));
      a.classList.add("active");

      // OPTIONAL: route based on link text
      const text = a.textContent.trim().toLowerCase();

      // Change these to your real page paths if you have them
      const routes = {
        "for you": "../pages/for-you.html",
        search: "../pages/search.html",
        points: "../pages/points.html",
        profile: "../pages/profile.html",
      };

      if (routes[text]) window.location.href = routes[text];
    });
  });

  // =========================
  // 3) PROFILE IMAGES: click small -> update big
  // =========================
  const bigImgBox = document.getElementById("profile-big-img");
  const smallImgs = document.querySelectorAll(".profile-small-img");

  // For demo: represent each small image as "Image 1/2/3..."
  smallImgs.forEach((box, index) => {
    box.dataset.imgLabel = `Image ${index + 1}`;
  });

  // Click big image -> open file picker (optional nice feature)
  // Since your HTML doesn't have <input type="file">, we'll skip upload
  // but we will let user "select" a small image to display.
  smallImgs.forEach((box) => {
    box.addEventListener("click", () => {
      if (!bigImgBox) return;

      // If last box is "6+", don't swap
      if (box.textContent.trim() === "6+") {
        alert("Show more photos (demo).");
        return;
      }

      // Set big box content
      bigImgBox.textContent = box.dataset.imgLabel || box.textContent.trim();
      // Optional: add a selected highlight
      smallImgs.forEach((b) => b.classList.remove("selected"));
      box.classList.add("selected");
    });
  });

  // =========================
  // 4) Order button navigation
  // =========================
  const orderBtn = document.getElementById("profile-order-btn");
  if (orderBtn) {
    orderBtn.addEventListener("click", () => {
      // Change to your real order page path
      window.location.href = "../pages/order.html";
    });
  }

  // =========================
  // 5) History cards click actions
  // =========================
  const historyCards = document.querySelectorAll(".profile-history-card");
  historyCards.forEach((card) => {
    card.addEventListener("click", () => {
      const title = card.querySelector("p")?.textContent?.trim() || "";

      // Example routing based on card text
      if (title.toLowerCase().includes("ordered")) {
        window.location.href = "../pages/order-history.html";
      } else if (title.toLowerCase().includes("popular")) {
        window.location.href = "../pages/popular.html";
      } else if (title.toLowerCase().includes("promotions")) {
        window.location.href = "../pages/promotions.html";
      } else {
        alert("This section is a demo.");
      }
    });
  });

  // =========================
  // 6) OPTIONAL: Populate profile from localStorage
  // =========================
  const usernameEl = document.getElementById("profile-username");
  const descEl = document.getElementById("profile-desc");

  const savedUser = localStorage.getItem("profile_username");
  const savedDesc = localStorage.getItem("profile_desc");

  if (usernameEl && savedUser) usernameEl.textContent = savedUser;
  if (descEl && savedDesc) descEl.textContent = savedDesc;
});
