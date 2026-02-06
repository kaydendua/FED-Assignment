const profilePic = document.getElementById("profilePic");
const fileInput = document.getElementById("fileInput");
const preview = document.getElementById("preview");

// when clicking the image box, open file picker
profilePic.addEventListener("click", () => {
  fileInput.click();
});

// when a file is selected, preview it
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      preview.src = reader.result;
    };
    reader.readAsDataURL(file);
  }
});



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
 
