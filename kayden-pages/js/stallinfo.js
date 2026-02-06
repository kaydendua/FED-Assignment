import { db } from "/firebase/firebase.js";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  documentId
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const reviewsContainer = document.getElementById("review-display");
const placeholder = document.getElementById("review-placeholder");
const reviewsPageBtn = document.getElementById("read-more-btn");

function getStallIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

const stallId = getStallIdFromUrl();

async function loadStallData() {
  reviewsContainer.innerHTML = "";

  if (!stallId) {
    reviewsContainer.innerHTML = "<p>No stall specified.</p>";
    return;
  }

  const stallSnap = await getDoc(doc(db, "stalls", stallId));
  if (!stallSnap.exists()) {
    reviewsContainer.innerHTML = "<p>Stall not found.</p>";
    return;
  }
  reviewsPageBtn.href = `reviews.html?id=${stallId}`;
  reviewsPageBtn.hidden = false;

  const stallData = stallSnap.data();
  const { reviews } = stallData;

  if (!reviews || reviews.length === 0) {
    displayStallInfo(stallData, 0, 0);
    reviewsContainer.innerHTML = "<p>No reviews yet.</p>";
    return;
  }

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
    placeholder.value = "No reviews here yet.";
    displayStallInfo(stallData, 0, 0);
    return;
  } else {
    placeholder.hidden = true;
  }

  // Calculate average rating from ALL reviews
  let totalRating = 0;
  allReviews.forEach(review => {
    totalRating += review.rating;
  });
  
  const averageRating = (totalRating / allReviews.length).toFixed(1);
  const reviewCount = allReviews.length;

  // Display stall info with accurate rating
  displayStallInfo(stallData, averageRating, reviewCount);

  // Display only the first 10 reviews in the preview
  const displayReviews = allReviews.slice(0, 10);
  displayReviews.forEach(review => {
    displayReview(review);
  });
}

function displayReview(review) {
  const card = document.createElement("div");
  card.className = "review";

  const descriptionPreview = review.description.length > 250 
    ? review.description.substring(0, 250) + "..." 
    : review.description;
  
  const needsReadMore = review.description.length > 250;

  card.innerHTML = `
    <div class="review-header">
      <h4>${review.title}</h4>
      <div>${"⭐".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</div>
    </div>
    <p class="review-writer">by ${review.author}</p>
    <p>${descriptionPreview}</p>

    <div class="review-footer">
      <span></span>
      ${needsReadMore ? `<a href="reviews.html?id=${stallId}" class="review-read-more">Read more</a>` : ''}
    </div>
  `;

  reviewsContainer.appendChild(card);
}

function displayStallInfo(stall, rating, reviewCount) {
  const div = document.getElementById("details-display");

  const ratingDisplay = rating > 0 
    ? `${rating} ⭐ <span class="review-count">(${reviewCount})</span>`
    : 'No ratings yet';

  div.innerHTML = `
    <div class="stall-header">
        <h2>${stall.name}</h2>
        <h2>${ratingDisplay}</h2>
    </div>
    <p>${stall.description}</p>
  `;
}

loadStallData();