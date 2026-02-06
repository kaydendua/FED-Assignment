// =========================
// Chart Data (Location + Range)
// month = past 3 months
// year  = past 12 months
// =========================

let selectedRange = "month";
let selectedLocation = "north";

const chartData = {
  north: {
    month: { labels: ["Dec", "Jan", "Feb"], data: [76, 82, 79] },
    year:  {
      labels: ["Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb"],
      data:   [70, 74, 72, 78, 83, 79, 85, 81, 76, 80, 77, 82]
    }
  },
  central: {
    month: { labels: ["Dec", "Jan", "Feb"], data: [68, 73, 70] },
    year:  {
      labels: ["Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb"],
      data:   [62, 66, 64, 71, 74, 70, 77, 73, 69, 72, 67, 71]
    }
  },
  east: {
    month: { labels: ["Dec", "Jan", "Feb"], data: [84, 79, 86] },
    year:  {
      labels: ["Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb"],
      data:   [78, 81, 77, 83, 86, 82, 88, 85, 80, 84, 79, 83]
    }
  }
};

// =========================
// Create Chart
// =========================

const ctx = document.getElementById("hygieneChart").getContext("2d");

let hygieneChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: chartData[selectedLocation][selectedRange].labels,
    datasets: [{
      label: "Hygiene Grade (%)",
      data: chartData[selectedLocation][selectedRange].data,
      borderWidth: 2,
      fill: false,
      tension: 0.3,
      pointRadius: 4
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: { stepSize: 10 }
      }
    }
  }
});

// =========================
// Helpers
// =========================

function updateChart() {
  const dataset = chartData[selectedLocation][selectedRange];
  hygieneChart.data.labels = dataset.labels;
  hygieneChart.data.datasets[0].data = dataset.data;
  hygieneChart.update();
}

function setActive(activeBtn, selector) {
  document.querySelectorAll(selector).forEach(btn => {
    const isActive = btn === activeBtn;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
}

// =========================
// Range Pills
// HTML: <div id="rangeGroup"> buttons have data-range="month|year"
// =========================

const rangeGroup = document.getElementById("rangeGroup");
if (rangeGroup) {
  rangeGroup.querySelectorAll(".pill").forEach(btn => {
    btn.addEventListener("click", () => {
      selectedRange = btn.dataset.range;
      setActive(btn, "#rangeGroup .pill");
      updateChart();
    });
  });
}

// =========================
// Location Pills
// HTML: <div id="locationGroup"> buttons have data-location="north|central|east"
// =========================

const locationGroup = document.getElementById("locationGroup");
if (locationGroup) {
  locationGroup.querySelectorAll(".pill").forEach(btn => {
    btn.addEventListener("click", () => {
      selectedLocation = btn.dataset.location;
      setActive(btn, "#locationGroup .pill");
      updateChart();
    });
  });
}

// default UI (ensures correct active states if page loads)
const defaultRangeBtn = document.querySelector('#rangeGroup .pill[data-range="month"]');
if (defaultRangeBtn) setActive(defaultRangeBtn, "#rangeGroup .pill");

const defaultLocBtn = document.querySelector('#locationGroup .pill[data-location="north"]');
if (defaultLocBtn) setActive(defaultLocBtn, "#locationGroup .pill");

// default selection
setActiveRange("month");

// ===== Search box logic =====
const searchBtn = document.getElementById("searchBtn");
const searchBox = document.getElementById("searchBox");

searchBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  searchBox.style.display =
    searchBox.style.display === "block" ? "none" : "block";
});

searchBox.addEventListener("click", (e) => e.stopPropagation());

document.addEventListener("click", () => {
  searchBox.style.display = "none";
});

