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

// Handle Accept/Decline button
document.querySelectorAll('.btn-accept').forEach(btn => {
    btn.addEventListener('click', function () {
        const cell = this.closest('td');

        cell.innerHTML = `
            <div class="order-status">
                <p>Accepted Order.</p>
                <button class="btn-ready">Ready</button>
            </div>
        `;

        attachReadyLogic(cell);
    });
});

document.querySelectorAll('.btn-decline').forEach(btn => {
    btn.addEventListener('click', function () {
        const cell = this.closest('td');
        cell.innerHTML = `<p>Declined Order.</p>`;
    });
});


// Handle Ready button
function readyLogic(cell) {
    const readyBtn = cell.querySelector('.btn-ready');

    readyBtn.addEventListener('click', function () {
        cell.innerHTML = `<p>Order Ready for Collection.</p>`;
    });
}