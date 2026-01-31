// File: js/rental.js
// Purpose: Calculates lease expiry and visualizes contract status.

document.addEventListener('DOMContentLoaded', () => {
    const rentalConfig = {
        expiryDate: '2027-01-01', // YYYY-MM-DD
        status: 'Active',
        lastRenewed: '2025-12-15'
    };

    const statusBox = document.querySelector('.status-indicator');
    const statusText = document.querySelector('.status-indicator p');

    if (statusBox && statusText) {
        const today = new Date();
        const expiry = new Date(rentalConfig.expiryDate);
        
        // Calculate difference in days
        const diffTime = expiry - today; 
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let statusMessage = `Effective: Valid Till ${rentalConfig.expiryDate}`;
        let colorClass = 'effective'; // Default green

        // Logic: Warning if expiring within 60 days
        if (diffDays < 0) {
            statusMessage = "EXPIRED: Please renew immediately";
            statusBox.style.backgroundColor = "#e74c3c"; // Red
        } else if (diffDays < 60) {
            statusMessage = `WARNING: Expires in ${diffDays} days. Renewal required.`;
            statusBox.style.backgroundColor = "#f39c12"; // Orange
        } else {
            statusMessage += ` (${diffDays} days remaining)`;
            statusBox.style.backgroundColor = "#2ecc71"; // Green
        }

        statusText.innerHTML = statusMessage;
    }
});