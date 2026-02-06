import { db } from '/firebase/firebase.js';
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  documentId
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const columnLeft = document.getElementById("left-column");
const columnRight = document.getElementById("right-column");
const placeholder = document.getElementById("placeholder");
const reviewsPageBtn = document.getElementById("back-btn");
const loadingIndicator = document.getElementById("loading-indicator");
const endMessage = document.getElementById("end-message");
const writeReviewBtn = document.getElementById("write-review-btn");

// Infinite scroll settings
const REVIEWS_PER_BATCH = 20;
let allReviews = [];
let displayedReviews = 0;
let isLoading = false;

function getStallIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

const stallId = getStallIdFromUrl();
reviewsPageBtn.setAttribute("href", `stallPage.html?id=${stallId}`);
writeReviewBtn.setAttribute("href", `writeReview.html?id=${stallId}`);

async function loadAllReviews() {
  // Clear columns
  columnLeft.innerHTML = "";
  columnRight.innerHTML = "";

  // Check if stallId exists
  if (!stallId) {
    placeholder.textContent = "No stall specified.";
    return;
  }

  const stallSnap = await getDoc(doc(db, "stalls", stallId));
  if (!stallSnap.exists()) {
    placeholder.textContent = "Stall not found.";
    return;
  }

  const stallData = stallSnap.data();
  const { reviews } = stallData;

  if (!reviews || reviews.length === 0) {
    placeholder.textContent = "No reviews yet for this stall.";
    return;
  }

  // Fetch all reviews in batches (Firestore 'in' operator limit is 30)
  allReviews = [];
  const batchSize = 30;
  
  for (let i = 0; i < reviews.length; i += batchSize) {
    const batch = reviews.slice(i, i + batchSize);
    
    const reviewsQuery = query(
      collection(db, "reviews"),
      where(documentId(), "in", batch)
    );

    const reviewSnap = await getDocs(reviewsQuery);
    
    reviewSnap.forEach((reviewDoc) => {
      const review = reviewDoc.data();
      if (review.anonymous) {
        review.author = "Anonymous";
      }
      allReviews.push(review);
    });
  }

  if (allReviews.length === 0) {
    placeholder.textContent = "No reviews found.";
    return;
  }

  // Hide placeholder
  placeholder.hidden = true;

  // Display first batch
  displayNextBatch();

  // Set up infinite scroll
  setupInfiniteScroll();
}

function displayNextBatch() {
  if (isLoading) return;
  
  const remainingReviews = allReviews.length - displayedReviews;
  
  if (remainingReviews === 0) {
    // All reviews displayed
    loadingIndicator.style.display = "none";
    endMessage.style.display = "block";
    return;
  }

  isLoading = true;
  loadingIndicator.style.display = "block";

  // Simulate a small delay for better UX (optional)
  setTimeout(() => {
    const endIndex = Math.min(displayedReviews + REVIEWS_PER_BATCH, allReviews.length);
    const batchReviews = allReviews.slice(displayedReviews, endIndex);

    // Display reviews in alternating columns
    batchReviews.forEach((review, index) => {
      // Calculate which column based on total displayed count
      const totalIndex = displayedReviews + index;
      const targetColumn = totalIndex % 2 === 0 ? columnLeft : columnRight;
      displayReviewFull(review, targetColumn);
    });

    displayedReviews = endIndex;
    isLoading = false;
    loadingIndicator.style.display = "none";

    // Check if all reviews are loaded
    if (displayedReviews >= allReviews.length) {
      endMessage.style.display = "block";
    }
  }, 300);
}

function setupInfiniteScroll() {
  window.addEventListener('scroll', () => {
    // Check if user is near bottom of page
    const scrollPosition = window.innerHeight + window.scrollY;
    const bottomPosition = document.documentElement.offsetHeight;
    
    // Trigger when user is 200px from bottom
    if (scrollPosition >= bottomPosition - 200) {
      if (!isLoading && displayedReviews < allReviews.length) {
        displayNextBatch();
      }
    }
  });
}

function displayReviewFull(review, targetColumn) {
  const card = document.createElement("div");
  card.className = "review";

  card.innerHTML = `
    <div class="review-header">
      <h3>${review.title}</h3>
      <div>${"⭐".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</div>
    </div>
    <p class="review-writer">by ${review.author}</p>
    <p>${review.description}</p>
  `;

  targetColumn.appendChild(card);
}

loadAllReviews();