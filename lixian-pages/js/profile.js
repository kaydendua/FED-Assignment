const profilePic = document.getElementById("profilePic");
const fileInput = document.getElementById("fileInput");
const preview = document.getElementById("preview");

// =====================
// PROFILE SAVE/LOAD
// =====================
const STORAGE_KEY = "hawkercentral_profile";

const fields = {
  name: document.getElementById("p-name"),
  officerId: document.getElementById("p-officerId"),
  designation: document.getElementById("p-designation"),
  department: document.getElementById("p-department"),
  email: document.getElementById("p-email"),
  phone: document.getElementById("p-phone"),
};

const saveBtn = document.getElementById("saveProfileBtn");
const clearBtn = document.getElementById("clearProfileBtn");
const saveStatus = document.getElementById("saveStatus");

function setStatus(msg) {
  if (!saveStatus) return;
  saveStatus.textContent = msg;
  if (msg) {
    setTimeout(() => (saveStatus.textContent = ""), 2000);
  }
}

function loadProfile() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;

  try {
    const data = JSON.parse(raw);

    fields.name.value = data.name ?? "";
    fields.officerId.value = data.officerId ?? "";
    fields.designation.value = data.designation ?? "";
    fields.department.value = data.department ?? "";
    fields.email.value = data.email ?? "";
    fields.phone.value = data.phone ?? "";

    if (data.imageDataUrl) {
      preview.src = data.imageDataUrl;
    }
  } catch (err) {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function saveProfile(extra = {}) {
  const data = {
    name: fields.name.value.trim(),
    officerId: fields.officerId.value.trim(),
    designation: fields.designation.value.trim(),
    department: fields.department.value.trim(),
    email: fields.email.value.trim(),
    phone: fields.phone.value.trim(),
    ...extra,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  setStatus("Saved ✓");
}

function clearProfile() {
  Object.values(fields).forEach((input) => (input.value = ""));
  preview.src = "../img/profile.png";

  localStorage.removeItem(STORAGE_KEY);
  setStatus("Cleared");
}

// load on page open
document.addEventListener("DOMContentLoaded", () => {
  loadProfile();
});

// save button
saveBtn.addEventListener("click", () => {
  const currentImg = preview.src.startsWith("data:image")
    ? { imageDataUrl: preview.src }
    : {};

  saveProfile(currentImg);
});

// clear button
clearBtn.addEventListener("click", clearProfile);

// =====================
// PROFILE PICTURE UPLOAD
// =====================

profilePic.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      preview.src = reader.result;

      // keep existing text fields, update image
      const raw = localStorage.getItem(STORAGE_KEY);
      let current = {};
      try {
        current = raw ? JSON.parse(raw) : {};
      } catch (e) {
        current = {};
      }
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ ...current, imageDataUrl: reader.result })
      );

      setStatus("Saved ✓");
    };
    reader.readAsDataURL(file);
  }
});

// =====================
// SEARCH DROPDOWN
// =====================
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

