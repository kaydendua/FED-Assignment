// Dropdown toggle
const loginDropdown = document.querySelector('.login-dropdown');
const dropdownContent = document.querySelector('.dropdown-content');

loginDropdown.addEventListener('click', () => {
  dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
});

// Close dropdown if clicked outside
window.addEventListener('click', (e) => {
  if (!loginDropdown.contains(e.target)) {
    dropdownContent.style.display = 'none';
  }
});
