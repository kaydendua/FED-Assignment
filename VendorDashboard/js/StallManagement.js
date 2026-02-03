document.addEventListener("DOMContentLoaded", () => {

    // Handle all existing checkboxes
    const checkboxes = document.querySelectorAll('.toggle-checkbox input[type="checkbox"]');

    checkboxes.forEach(cb => {
        updateStatus(cb); // set initial text

        cb.addEventListener('change', () => {
            updateStatus(cb);
        });
    });

    function updateStatus(checkbox) {
        const statusText = checkbox.parentElement.querySelector('.status-text');

        if (checkbox.checked) {
            statusText.textContent = "Available";
            statusText.style.color = "#2e7d32";
        } else {
            statusText.textContent = "Unavailable";
            statusText.style.color = "#c62828";
        }
    }

});
