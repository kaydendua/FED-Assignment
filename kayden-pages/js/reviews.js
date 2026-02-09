import { db } from '../../firebase/firebase.js';
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
const writeReviewBtn = document.getElementById("write-review-btn");

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
  const allReviews = [];
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

  // Display all reviews at once
  allReviews.forEach((review, index) => {
    const targetColumn = index % 2 === 0 ? columnLeft : columnRight;
    displayReviewFull(review, targetColumn);
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