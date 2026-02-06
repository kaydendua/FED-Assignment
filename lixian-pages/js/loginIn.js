document.addEventListener("DOMContentLoaded", () => {
  // Dropdown menu
  const loginMenuBtn = document.getElementById("loginMenuBtn");
  const loginMenu = document.getElementById("loginMenu");

  if (loginMenuBtn && loginMenu) {
    loginMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      loginMenu.hidden = !loginMenu.hidden;
    });

    // close dropdown when clicking outside
    document.addEventListener("click", () => {
      loginMenu.hidden = true;
    });
  }

  // Toggle show/hide password
  const passwordInput = document.getElementById("password");
  const togglePasswordBtn = document.getElementById("togglePassword");

  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener("click", () => {
      const isHidden = passwordInput.type === "password";
      passwordInput.type = isHidden ? "text" : "password";
      togglePasswordBtn.textContent = isHidden ? "Hide" : "Show";
    });
  }

  // Handle login submit (ONLY ONE)
  const loginForm = document.getElementById("loginForm");

  if (!loginForm) {
    console.error("loginForm not found. Check id='loginForm' in HTML.");
    return;
  }

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const officerId = document.getElementById("officerId")?.value.trim();
    const password = document.getElementById("password")?.value;
    const rememberMe = document.getElementById("rememberMe")?.checked;

    if (!officerId || !password) {
      alert("Please enter both OfficerID and Password.");
      return;
    }

    console.log("OfficerID:", officerId);
    console.log("Remember Me:", rememberMe);

    // redirect to main page
    window.location.href = "../lixian-pages/main-page.html";
  });
});






