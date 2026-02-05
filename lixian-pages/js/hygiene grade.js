const ctx = document.getElementById("hygieneChart").getContext("2d");

let chartData = {
    week: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        data: [85, 88, 90, 87, 92, 89, 91]
    },
    month: {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        data: [88, 90, 87, 92]
    },
    year: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                 "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        data: [85, 86, 88, 87, 89, 90, 91, 92, 90, 89, 88, 91]
    }
};

let hygieneChart = new Chart(ctx, {
    type: "line",
    data: {
        labels: chartData.week.labels,
        datasets: [{
            label: "Hygiene Grade (%)",
            data: chartData.week.data,
            borderWidth: 2,
            fill: false
        }]
    }
});

// Dropdown change event
document.getElementById("timeRange").addEventListener("change", function () {
    let selectedRange = this.value;

    hygieneChart.data.labels = chartData[selectedRange].labels;
    hygieneChart.data.datasets[0].data = chartData[selectedRange].data;
    hygieneChart.update();
});
