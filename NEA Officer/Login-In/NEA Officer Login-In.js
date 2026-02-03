// Toggle dropdown menu
const loginMenuBtn = document.getElementById('loginMenuBtn');
const loginMenu = document.getElementById('loginMenu');

loginMenuBtn.addEventListener('click', () => {
  loginMenu.hidden = !loginMenu.hidden;
});

// Handle form submission
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', (e) => {
  e.preventDefault(); // prevent page reload

  const officerId = document.getElementById('officerId').value;
  const password = document.getElementById('password').value;
  const rememberMe = document.getElementById('rememberMe').checked;

  if (!officerId || !password) {
    alert('Please enter both OfficerID and Password.');
    return;
  }

  console.log('OfficerID:', officerId);
  console.log('Password:', password);
  console.log('Remember Me:', rememberMe);

  alert('Login submitted (demo).');
});

// Toggle show/hide password
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('togglePassword');

togglePasswordBtn.addEventListener('click', () => {
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    togglePasswordBtn.textContent = 'Hide';
  } else {
    passwordInput.type = 'password';
    togglePasswordBtn.textContent = 'Show';
  }
});

