// =========================
// Chart Data (Location + Range)
// month = past 3 months
// year  = past 12 months
// =========================

let selectedRange = "month";
let selectedLocation = "north";

// More varied / random-looking data (can dip to 40s and rise to 90s)
const chartData = {
  north: {
    month: { labels: ["Dec", "Jan", "Feb"], data: [76, 82, 79] },
    year:  {
      labels: ["Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb"],
      data:   [65, 72, 58, 75, 83, 69, 88, 77, 61, 80, 74, 82]
    }
  },
  central: {
    month: { labels: ["Dec", "Jan", "Feb"], data: [54, 63, 49] },
    year:  {
      labels: ["Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb"],
      data:   [60, 52, 47, 69, 58, 41, 74, 66, 55, 71, 62, 50]
    }
  },
  east: {
    month: { labels: ["Dec", "Jan", "Feb"], data: [88, 71, 90] },
    year:  {
      labels: ["Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb"],
      data:   [79, 86, 73, 91, 84, 62, 89, 76, 68, 83, 70, 88]
    }
  },
  west: {
    month: { labels: ["Dec", "Jan", "Feb"], data: [42, 58, 47] },
    year:  {
      labels: ["Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb"],
      data:   [55, 44, 63, 51, 72, 40, 66, 59, 48, 74, 61, 53]
    }
  },
  south: {
    month: { labels: ["Dec", "Jan", "Feb"], data: [91, 67, 84] },
    year:  {
      labels: ["Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb"],
      data:   [88, 73, 95, 81, 64, 77, 90, 58, 69, 92, 75, 86]
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
// Location Pills (now includes west + south)
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

// default UI
const defaultRangeBtn = document.querySelector('#rangeGroup .pill[data-range="month"]');
if (defaultRangeBtn) setActive(defaultRangeBtn, "#rangeGroup .pill");

const defaultLocBtn = document.querySelector('#locationGroup .pill[data-location="north"]');
if (defaultLocBtn) setActive(defaultLocBtn, "#locationGroup .pill");

// ===== Search box logic =====
document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchBtn");
  const searchBox = document.getElementById("searchBox");

  searchBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    searchBox.style.display =
      searchBox.style.display === "block" ? "none" : "block";
  });

  searchBox.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  document.addEventListener("click", () => {
    searchBox.style.display = "none";
  });
});


