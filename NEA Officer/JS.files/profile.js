let fileInput = document.getElementById("fileInput");
let profilePic = document.getElementById("profilePic");
let preview = document.getElementById("preview");

// When user clicks profile picture, open file picker
profilePic.addEventListener("click", () => {
  fileInput.click();
});

// When user selects a file, show preview
fileInput.addEventListener("change", () => {
  let file = fileInput.files[0];

  if (file && file.type.startsWith("image/")) {
    let reader = new FileReader();

    reader.onload = (e) => {
      preview.src = e.target.result;
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

