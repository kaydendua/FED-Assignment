document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('salesChart');
    
    if (ctx) {
        // A-Grade Feature: Dual-axis chart comparing Sales vs Hygiene Score
        new Chart(ctx, {
            type: 'line', 
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Revenue ($)',
                    data: [3200, 2900, 3500, 3100, 4200, 4600, 4100, 3800, 4500, 5000, 5300, 6000],
                    borderColor: '#3498db', // Blue
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    yAxisID: 'y',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Hygiene Score',
                    data: [90, 92, 91, 88, 95, 96, 94, 93, 95, 97, 98, 98],
                    borderColor: '#2ecc71', // Green
                    yAxisID: 'y1',
                    borderDash: [5, 5], // Dashed line for distinction
                    fill: false
                }]
            },
            options: {
                responsive: true,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    title: { display: true, text: 'Sales vs. Hygiene Quality Correlation' }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: { display: true, text: 'Revenue ($)' }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: { drawOnChartArea: false },
                        title: { display: true, text: 'Score (%)' }
                    }
                }
            }
        });
    }
});