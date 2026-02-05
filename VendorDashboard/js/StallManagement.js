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

// Handle accept, decline, and ready
    document.querySelectorAll('#queue-list tr').forEach(row => {

        const statusText = row.querySelector('.order-status');
        const acceptBtn = row.querySelector('.btn-accept');
        const declineBtn = row.querySelector('.btn-decline');
        const readyBtn = row.querySelector('.btn-ready');

        acceptBtn.addEventListener('click', () => {
            statusText.textContent = "Accepted Order";
            acceptBtn.style.display = "none";
            declineBtn.style.display = "none";
            readyBtn.style.display = "inline-block";
        });

        declineBtn.addEventListener('click', () => {
            statusText.textContent = "Declined Order";
            acceptBtn.style.display = "none";
            declineBtn.style.display = "none";
        });

        readyBtn.addEventListener('click', () => {
            statusText.textContent = "Order Ready for Collection";
            readyBtn.style.display = "none";
        });
    });
});