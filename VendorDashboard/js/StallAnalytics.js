document.addEventListener("DOMContentLoaded", function () {
    const ctx = document.getElementById('salesChart').getContext('2d');

    // Create a gradient for the bars
    let gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, '#4988BB');
    gradient.addColorStop(1, '#749ec16e');

    const ctxBestSelling = document.getElementById('bestSellingChart').getContext('2d');
    
    new Chart(ctxBestSelling, {
        type: 'doughnut',
        data: {
            labels: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'],
            datasets: [{
                data: [30, 15, 20, 10, 25], // Example data matching visual proportions
                backgroundColor: [
                    '#bbdefb', 
                    '#ffcc80', 
                    '#f8bbd0', 
                    '#b9f6ca', 
                    '#e1bee7'  
                ],
                borderWidth: 1 , // No border as per image
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'left', // Moves legend to the left side
                    labels: {
                        font: {
                            size: 14
                        },
                        boxWidth: 20,
                        padding: 20
                    }
                }
            },
            layout: {
                padding: 20
            }
        }
    });

    const salesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            // Labels for the last 12 months
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Sales Revenue ($)',
                // Dummy data matching the heights in your image (~1800 to 2200 range)
                data: [4500, 3550, 4700, 4850, 4200, 4100, 4450, 3950, 4850, 4250, 3900, 4900],
                backgroundColor: gradient, // Apply the gradient created above
                
                borderWidth: 0,
                barPercentage: 0.7, // Width of bars relative to category width
                borderRadius: 4 // Slight rounding at the top of bars
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true, // keeps the aspect ratio
            plugins: {
                legend: {
                    display: false // Hides the label "Sales Revenue" box at top (not in your image)
                },
                tooltip: {
                    enabled: true
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 5000, // Matches the top scale in your image
                    ticks: {
                        stepSize: 500, // Matches the intervals (200, 400, 600...)
                        font: {
                            size: 10
                        }
                    },
                    grid: {
                        color: '#e5e5e5', // Light grid lines
                        borderDash: [5, 5] // Dashed lines like in the design
                    }
                },
                x: {
                    grid: {
                        display: false // Removes vertical grid lines
                    }
                }
            }
        }
    });
});
