document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // DATA (keep same as mainpage.js)
  // =========================
  const inspections = [
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

    {
      date: "2026-02-22",
      locationShort: "Ngee Ann Polytecnic FoodClub",
      timeShort: "2pm",
      inspectionId: "INSP-2026-014",
      inspector: "Alex Tan",
      areaInspected: "The FoodStall in FoodClub",
      scores: null,
      rating: "",
      grade: "",
      notes: ""
    }
  ];

  const inspectionMap = new Map(inspections.map(i => [i.date, i]));

  // =========================
  // HELPERS
  // =========================
  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = text ?? "";
  };

  const setEditableText = (id, text) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = text ?? "";
  };

  const niceDate = (iso) => {
    const [y, m, d] = iso.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  };

  const dayName = (iso) => {
    const [y, m, d] = iso.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
  };

  const totalScore = (scores) => {
    if (!scores) return "";
    const got = scores.safety.got + scores.hygiene.got + scores.equipment.got + scores.docs.got;
    const max = scores.safety.max + scores.hygiene.max + scores.equipment.max + scores.docs.max;
    return `${got} / ${max}`;
  };

  // =========================
  // LOAD BY DATE PARAM
  // =========================
  const params = new URLSearchParams(window.location.search);
  const iso = params.get("date") || "2026-01-01"; // fallback

  const insp = inspectionMap.get(iso);

  // Left side (zoom date)
  setText("recDayName", dayName(iso));
  setText("recDayNumber", iso.split("-")[2]);

  if (insp && insp.locationShort) {
    setText("recTitleLine", `Inspection at ${insp.locationShort}`);
    setText("recTimeLine", `Time: ${insp.timeShort || ""}`.trim());
  } else {
    setText("recTitleLine", "Inspection (details pending)");
    setText("recTimeLine", "");
  }

  // Right side info (these are <b> fields in your HTML)
  setText("recDate", niceDate(iso));
  setText("recId", insp ? insp.inspectionId : "");
  setText("recInspector", insp ? insp.inspector : "");
  setText("recLocation", insp ? insp.areaInspected : "");

  // Scores (editable cells)
  if (insp && insp.scores) {
    setEditableText("s1", `${insp.scores.safety.got} / ${insp.scores.safety.max}`);
    setEditableText("s2", `${insp.scores.hygiene.got} / ${insp.scores.hygiene.max}`);
    setEditableText("s3", `${insp.scores.equipment.got} / ${insp.scores.equipment.max}`);
    setEditableText("s4", `${insp.scores.docs.got} / ${insp.scores.docs.max}`);
    setEditableText("recTotal", totalScore(insp.scores));
  } else {
    // Feb 22: no values provided
    setEditableText("s1", "");
    setEditableText("s2", "");
    setEditableText("s3", "");
    setEditableText("s4", "");
    setEditableText("recTotal", "");
  }

  setEditableText("recRating", insp ? insp.rating : "");
  setEditableText("recGrade", insp ? insp.grade : "");

  // Notes (contenteditable + placeholder class)
  const notes = document.getElementById("recNotes");
  if (notes) {
    if (insp && insp.notes) notes.textContent = insp.notes;
    else notes.textContent = ""; // Feb 22: blank
  }

  // =========================
  // AUTOSAVE PER DATE (so each record saves separately)
  // =========================
  const datePrefix = `record_${iso}_`;

  document.querySelectorAll("[contenteditable='true']").forEach(el => {
    if (!el.id) return;
    const key = datePrefix + el.id;

    const saved = localStorage.getItem(key);
    if (saved !== null) {
      el.textContent = saved;
    }

    el.addEventListener("input", () => {
      const value = el.textContent;
      // Don't save empty notes placeholder text (keep truly empty)
      if (el.id === "recNotes" && value.trim() === "") {
        localStorage.removeItem(key);
        return;
      }
      localStorage.setItem(key, value);
    });
  });

  // =========================
  // NOTES PLACEHOLDER LOGIC (shadow text)
  // =========================
  if (notes) {
    const isEmpty = () => notes.textContent.trim() === "";

    if (isEmpty()) {
      notes.classList.add("is-empty");
      notes.innerHTML = "";
    } else {
      notes.classList.remove("is-empty");
    }

    notes.addEventListener("focus", () => {
      notes.classList.remove("is-empty");
      if (isEmpty()) notes.innerHTML = "";
    });

    notes.addEventListener("input", () => {
      if (isEmpty()) {
        notes.classList.add("is-empty");
        notes.innerHTML = "";
      } else {
        notes.classList.remove("is-empty");
      }
    });

    notes.addEventListener("blur", () => {
      if (isEmpty()) {
        notes.classList.add("is-empty");
        notes.innerHTML = "";
      }
    });
  }

  // =========================
  // SEARCH DROPDOWN
  // =========================
  const searchBtn = document.getElementById("searchBtn");
  const searchBox = document.getElementById("searchBox");

  if (searchBtn && searchBox) {
    searchBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      searchBox.style.display =
        searchBox.style.display === "block" ? "none" : "block";
    });

    searchBox.addEventListener("click", (e) => e.stopPropagation());

    document.addEventListener("click", () => {
      searchBox.style.display = "none";
    });
  }
});

// set grade from inspection data (or blank for future)
setEditableText("recGrade", insp ? insp.grade : "");

// autosave per date (this already saves recGrade because it's contenteditable)
document.querySelectorAll("[contenteditable='true']").forEach(el => {
  if (!el.id) return;
  const key = datePrefix + el.id;

  const saved = localStorage.getItem(key);
  if (saved !== null) {
    el.textContent = saved;
  }

  el.addEventListener("input", () => {
    const value = el.textContent;

    // Only notes has special behavior
    if (el.id === "recNotes" && value.trim() === "") {
      localStorage.removeItem(key);
      return;
    }

    localStorage.setItem(key, value);
  });
});



