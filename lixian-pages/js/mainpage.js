// =========================
// INSPECTION DATA
// =========================
const inspections = [
  // ===== Existing Jan record =====
  {
    date: "2026-01-01",
    locationShort: "Woodlands Hawker Centre",
    timeShort: "1pm",

    inspectionId: "INSP-2026-014",
    inspector: "Alex Tan",
    areaInspected: "Main Kitchen & Food Preparation Area",

    scores: {
      safety: { max: 25, got: 23 },
      hygiene: { max: 25, got: 22 },
      equipment: { max: 25, got: 18 },
      docs: { max: 25, got: 24 }
    },

    rating: "Excellent",
    grade: "A",
    notes:
      "The overall hygiene standard of the premise is high. Food preparation surfaces were clean and properly sanitised..."
  },

  // ===== NEW: Feb 4 (random values, DIFFERENT) =====
  {
    date: "2026-02-04",
    locationShort: "Tiong Bahru Market",
    timeShort: "10:30am",

    inspectionId: "INSP-2026-014",
    inspector: "Alex Tan",
    areaInspected: "Stall Prep Area & Cold Storage",

    scores: {
      safety: { max: 25, got: 19 },
      hygiene: { max: 25, got: 24 },
      equipment: { max: 25, got: 21 },
      docs: { max: 25, got: 17 }
    },

    rating: "Good",
    grade: "B",
    notes:
      "Hygiene practices were generally satisfactory. Minor issues observed: inadequate labeling on a few stored items and inconsistent temperature logging. Recommended improving record-keeping frequency and reinforcing storage rotation checks."
  },

  // ===== NEW: Feb 22 (NO values yet) =====
  {
    date: "2026-02-22",
    locationShort: "Ngee Ann Polytecnic FoodClub",
    timeShort: "2pm",

    inspectionId: "INSP-2026-014",
    inspector: "Alex Tan",
    areaInspected: "",

    scores: null,
    rating: "",
    grade: "",
    notes: ""
  }
];

// quick lookup by date
const inspectionMap = new Map(inspections.map(i => [i.date, i]));


// =========================
// ELEMENTS
// =========================
const monthYear = document.getElementById('monthYear');
const calendarDays = document.getElementById('calendarDays');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

const monthSelect = document.getElementById("monthSelect");
const yearSelect  = document.getElementById("yearSelect");

let currentDate = new Date();

const monthNames = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

// helper: yyyy-mm-dd
function toISODate(year, monthIndex, day){
  const mm = String(monthIndex + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

// =========================
// CALENDAR RENDER
// =========================
function renderCalendar() {
  calendarDays.innerHTML = '';

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  monthYear.textContent = monthNames[month] + ' ' + year;

  // day headers
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  dayNames.forEach(d => {
    const div = document.createElement('div');
    div.className = 'day header';
    div.textContent = d;
    calendarDays.appendChild(div);
  });

  // blank cells before 1st day
  for (let i = 0; i < firstDay; i++) {
    const div = document.createElement('div');
    div.className = 'day empty';
    calendarDays.appendChild(div);
  }

  // day cells
  for (let d = 1; d <= lastDate; d++) {
    const div = document.createElement('div');
    div.className = 'day';

    const iso = toISODate(year, month, d);
    const insp = inspectionMap.get(iso);

    // today highlight
    const today = new Date();
    if (
      d === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      div.classList.add('today');
    }

    // default day number
    div.innerHTML = `<div class="dayTop">${d}</div>`;

    // if there is an inspection: add text + clickable
    if (insp) {
      div.classList.add("has-inspection");

      div.innerHTML = `
        <div class="dayTop">${d}</div>
        <div class="inspText">
          Inspection at ${insp.locationShort}<br>
          Time: ${insp.timeShort}
        </div>
      `;

      const goToRecord = () => {
        window.location.href = `records.html?date=${iso}`;
      };

      div.addEventListener("click", goToRecord);

      // keyboard accessibility
      div.setAttribute("role", "button");
      div.setAttribute("tabindex", "0");
      div.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goToRecord();
        }
      });
    }

    calendarDays.appendChild(div);
  }

  // keep dropdowns synced
  syncPickersToDate();
}

// =========================
// PREV / NEXT
// =========================
prevBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

nextBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

// =========================
// SEARCH DROPDOWN
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchBtn");
  const searchBox = document.getElementById("searchBox");

  if (!searchBtn || !searchBox) return;

  searchBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    searchBox.style.display = (searchBox.style.display === "block") ? "none" : "block";
  });

  searchBox.addEventListener("click", (e) => e.stopPropagation());

  document.addEventListener("click", () => {
    searchBox.style.display = "none";
  });
});

// =========================
// MONTH / YEAR PICKERS
// =========================

// fill month dropdown
monthNames.forEach((m, idx) => {
  const opt = document.createElement("option");
  opt.value = idx;
  opt.textContent = m;
  monthSelect.appendChild(opt);
});

// fill year dropdown
const startYear = 2020;
const endYear = 2035;

for (let y = startYear; y <= endYear; y++) {
  const opt = document.createElement("option");
  opt.value = y;
  opt.textContent = y;
  yearSelect.appendChild(opt);
}

function syncPickersToDate(){
  monthSelect.value = currentDate.getMonth();
  yearSelect.value  = currentDate.getFullYear();
}

monthSelect.addEventListener("change", () => {
  currentDate.setMonth(parseInt(monthSelect.value, 10));
  renderCalendar();
});

yearSelect.addEventListener("change", () => {
  currentDate.setFullYear(parseInt(yearSelect.value, 10));
  renderCalendar();
});

// =========================
// INIT
// =========================
syncPickersToDate();
renderCalendar();

 