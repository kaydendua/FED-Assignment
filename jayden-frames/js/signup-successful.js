document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.querySelector(".menu-btn");

  const loginLink = document.getElementById("nav-login");
  const contactLink = document.getElementById("nav-contact");

  const usernameSpan = document.getElementById("v-complete-username");
  const loginBtn = document.getElementById("v-complete-login-btn");
  const socials = document.getElementById("v-complete-socials");

  const savedUsername =
    localStorage.getItem("vendorUsername") ||
    localStorage.getItem("username") ||
    localStorage.getItem("currentUserName");

  if (savedUsername && usernameSpan) {
    usernameSpan.textContent = savedUsername;
  }

  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      alert("Menu clicked (open sidebar / navigation here)");
    });
  }

  if (loginLink) {
    loginLink.addEventListener("click", (e) => {
      e.preventDefault();
      alert("Redirecting to login...");
      // window.location.href = "vendor-login.html";
    });
  }

  if (contactLink) {
    contactLink.addEventListener("click", (e) => {
      e.preventDefault();
      alert("Contact us clicked (go to contact page here)");
      // window.location.href = "contact.html";
    });
  }

  if (loginBtn) {
    loginBtn.addEventListener("click", () => {
      alert("Taking you to the login page...");
      // window.location.href = "vendor-login.html";
    });
  }

  if (socials) {
    socials.addEventListener("click", (e) => {
      const target = e.target;
      if (target && target.tagName === "SPAN") {
        alert("Social link clicked (connect to your social page here)");
      }
    });
  }
});

