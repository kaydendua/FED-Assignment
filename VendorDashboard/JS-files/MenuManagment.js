// File: js/menu.js
// Purpose: Handles menu item toggles and sustainability features.

document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.menu-item input[type="checkbox"]');

    // Load saved states from LocalStorage
    menuItems.forEach(box => {
        const savedState = localStorage.getItem(box.id);
        if (savedState === 'true') box.checked = true;
        if (savedState === 'false') box.checked = false;

        // Add Event Listener for toggling
        box.addEventListener('change', (e) => {
            const isAvailable = e.target.checked;
            const itemName = e.target.closest('.menu-item').querySelector('h4').innerText;
            
            // Save state
            localStorage.setItem(e.target.id, isAvailable);
            
            // Visual feedback
            const statusLabel = e.target.nextElementSibling;
            statusLabel.innerText = isAvailable ? "Available" : "Sold Out";
            statusLabel.style.color = isAvailable ? "#2ecc71" : "#e74c3c";
            
            console.log(`Menu Update: ${itemName} is now ${statusLabel.innerText}`);
        });
    });

    // "Add New Item" Button Logic
    const addItemBtn = document.querySelector('.add-item-btn');
    if (addItemBtn) {
        addItemBtn.addEventListener('click', () => {
            alert("Opening Add Menu Item Modal... (Feature pending implementation)");
        });
    }
});