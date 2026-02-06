import { db, getCurrentUser } from '/firebase/firebase.js';
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const backBtn = document.getElementById("back-btn");
const starButtons = document.querySelectorAll(".star-btn");
const reviewTitle = document.getElementById("review-title");
const reviewText = document.getElementById("review-text");
const charCounter = document.getElementById("char-counter");
const anonymousToggle = document.getElementById("anonymous-toggle");
const submitBtn = document.getElementById("submit-btn");

let selectedRating = 0;

function getStallIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

const stallId = getStallIdFromUrl();
backBtn.setAttribute("href", `reviews.html?id=${stallId}`);

const user = await getCurrentUser();

// Star rating functionality
starButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    selectedRating = parseInt(button.dataset.rating);
    updateStars(selectedRating);
  });

  // Hover effect
  button.addEventListener("mouseenter", () => {
    const hoverRating = parseInt(button.dataset.rating);
    starButtons.forEach((btn, i) => {
      if (i < hoverRating) {
        btn.classList.add("hovered");
      } else {
        btn.classList.remove("hovered");
      }
    });
  });
});

// Remove hover effect when mouse leaves star rating area
document.getElementById("star-rating").addEventListener("mouseleave", () => {
  starButtons.forEach(btn => btn.classList.remove("hovered"));
});

function updateStars(rating) {
  starButtons.forEach((btn, index) => {
    if (index < rating) {
      btn.classList.add("active");
      btn.textContent = "⭐";
    } else {
      btn.classList.remove("active");
      btn.textContent = "☆";
    }
  });
}

// Character counter
reviewText.addEventListener("input", () => {
  const length = reviewText.value.length;
  charCounter.textContent = length;
  
  if (length > 950) {
    charCounter.style.color = "#dc3545";
  } else {
    charCounter.style.color = "#666";
  }
});

// Submit review
submitBtn.addEventListener("click", async () => {

  // Validation
  if (selectedRating === 0) {
    alert("Please select a star rating!");
    return;
  }

  if (!reviewTitle.value.trim()) {
    alert("Please enter a review title!");
    return;
  }

  if (!reviewText.value.trim()) {
    alert("Please write your review!");
    return;
  }

  if (!stallId) {
    alert("Stall ID not found!");
    return;
  }

  // Disable submit button
  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  try {
    const reviewData = {
      title: reviewTitle.value.trim(),
      description: reviewText.value.trim(),
      rating: selectedRating,
      anonymous: anonymousToggle.checked,
      author: !user ? user.name : "Guest",
      createdAt: serverTimestamp(),
      stallId: stallId
    };

    // update review and stall doc
    const reviewRef = await addDoc(collection(db, "reviews"), reviewData);

    const stallRef = doc(db, "stalls", stallId);
    const stallDoc = await getDoc(stallRef);
    const currentData = stallDoc.data();

    const currentAvg = currentData.averageRating || 0;
    const currentCount = currentData.reviewCount || 0;
    const newCount = currentCount + 1;
    const newAvg = ((currentAvg * currentCount) + selectedRating) / newCount;

    await updateDoc(stallRef, {
    reviews: arrayUnion(reviewRef.id),
    averageRating: newAvg,
    reviewCount: newCount
    });

    window.location.href = `reviews.html?id=${stallId}`;

  } catch (error) {
    console.error("Error submitting review:", error);
    alert("Failed to submit review. Please try again.");
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Review";
  }
});