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
// replace with actual stall ID (from URL, etc.)
const stallId = "1";

async function loadReviews() {
  reviewsContainer.innerHTML = "";

  // 1. Get stall document
  const stallSnap = await getDoc(doc(db, "stalls", stallId));
  if (!stallSnap.exists()) {
    reviewsContainer.innerHTML = "<p>Stall not found.</p>";
    return;
  }

  const { reviews } = stallSnap.data();
  if (!reviews || reviews.length === 0) {
    reviewsContainer.innerHTML = "<p>No reviews yet.</p>";
    return;
  }

  // 2. Firestore "in" query (max 10)
  const reviewsQuery = query(
    collection(db, "reviews"),
    where(documentId(), "in", reviews.slice(0, 10))
  );

  const reviewSnap = await getDocs(reviewsQuery);

  

  if (reviewSnap.empty) {
    placeholder.value = "No reviews here yet.";
    return;
  } else {
    placeholder.hidden = true;
  }
  for (const reviewDoc of reviewSnap.docs) {
    const review = reviewDoc.data();
    if (review.anonymous) {
      review.author = "Anonymous";
    }
    displayReview(review);
  }
}

function displayReview(review) {
  const div = document.createElement("div");
  div.className = "review";

  div.innerHTML = `
    <div class="review-header">
      <h4>${review.title}</h4>
      <h4>${"⭐".repeat(review.rating)}${"☆".repeat(5 - review.rating)}</h4>
    </div>
    <p class="review-writer">by ${review.author}</p>
    <p>${review.description}</p>
  `;

  reviewsContainer.appendChild(div);
}

loadReviews();
