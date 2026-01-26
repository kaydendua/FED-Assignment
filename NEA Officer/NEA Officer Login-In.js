    // Toggle dropdown menu
    let loginMenuBtn = document.getElementById('loginMenuBtn');
    let loginMenu = document.getElementById('loginMenu');

    loginMenuBtn.addEventListener('click', () => {
      loginMenu.hidden = !loginMenu.hidden;
    });

    // Handle login button click
    let loginBtn = document.getElementById('loginBtn');

    loginBtn.addEventListener('click', () => {
      let officerId = document.getElementById('officerId').value;
      let password = document.getElementById('password').value;
      let rememberMe = document.getElementById('rememberMe').checked;

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