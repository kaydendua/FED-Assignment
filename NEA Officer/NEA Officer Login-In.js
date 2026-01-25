    // Toggle dropdown menu
    const loginMenuBtn = document.getElementById('loginMenuBtn');
    const loginMenu = document.getElementById('loginMenu');

    loginMenuBtn.addEventListener('click', () => {
      loginMenu.hidden = !loginMenu.hidden;
    });

    // Handle login button click
    const loginBtn = document.getElementById('loginBtn');

    loginBtn.addEventListener('click', () => {
      const officerId = document.getElementById('officerId').value;
      const password = document.getElementById('password').value;
      const rememberMe = document.getElementById('rememberMe').checked;

      if (!officerId || !password) {
        alert('Please enter both OfficerID and Password.');
        return;
      }

      // Placeholder for real login logic
      console.log('OfficerID:', officerId);
      console.log('Password:', password);
      console.log('Remember Me:', rememberMe);

      alert('Login submitted (demo).');
    });

    window.addEventListener('resize', handleResize);
    handleResize();