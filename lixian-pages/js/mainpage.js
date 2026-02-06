const monthYear = document.getElementById('monthYear');
const calendarDays = document.getElementById('calendarDays');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

let currentDate = new Date();

function renderCalendar() {
  calendarDays.innerHTML = '';

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  monthYear.textContent = monthNames[month] + ' ' + year;

  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  dayNames.forEach(d => {
    const div = document.createElement('div');
    div.className = 'day header';
    div.textContent = d;
    calendarDays.appendChild(div);
  });

  for (let i = 0; i < firstDay; i++) {
    const div = document.createElement('div');
    div.className = 'day';
    calendarDays.appendChild(div);
  }

  for (let d = 1; d <= lastDate; d++) {
    const div = document.createElement('div');
    div.className = 'day';
    div.textContent = d;

    const today = new Date();
    if (
      d === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      div.classList.add('today');
    }

    calendarDays.appendChild(div);
  }
}

prevBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

nextBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

renderCalendar();

document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchBtn");
  const searchBox = document.getElementById("searchBox");

  if (!searchBtn || !searchBox) return; // safety

  searchBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    searchBox.style.display = (searchBox.style.display === "block") ? "none" : "block";
  });

  // prevent clicks inside the box from closing it
  searchBox.addEventListener("click", (e) => e.stopPropagation());

  // click anywhere else closes it
  document.addEventListener("click", () => {
    searchBox.style.display = "none";
  });
});

const monthSelect = document.getElementById("monthSelect");
const yearSelect  = document.getElementById("yearSelect");

const monthNames = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

// fill month dropdown
monthNames.forEach((m, idx) => {
  const opt = document.createElement("option");
  opt.value = idx;
  opt.textContent = m;
  monthSelect.appendChild(opt);
});

// fill year dropdown (adjust range as you like)
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
 