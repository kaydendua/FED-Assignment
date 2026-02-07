// 1. Import the necessary Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    query, 
    orderBy, 
    getDocs,
    where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 2. Your Web App's Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDTYTjyaAt1FwKbHmZX1A1kiayskiFRBUw",
  authDomain: "fed-assignment-f0cd8.firebaseapp.com",
  projectId: "fed-assignment-f0cd8",
  storageBucket: "fed-assignment-f0cd8.firebasestorage.app",
  messagingSenderId: "114542382438",
  appId: "1:114542382438:web:3227de541d821031004ca7",
  measurementId: "G-VDMMRF2WE5"
};

// 3. Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM Elements
const reviewsContainer = document.getElementById('reviews-list');
const avgScoreElement = document.getElementById('avg-score');
const totalCountElement = document.getElementById('total-count');

// 4. Main Function to Fetch and Display Reviews
async function loadCustomerSatisfaction() {
    try {
        console.log("Fetching reviews...");
        
        // Query the 'reviews' collection, sorted by newest first
        // Note: Ensure you have an index in Firebase if using 'orderBy' on 'createdAt'
        const reviewsQuery = query(
            collection(db, "reviews"), 
            orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(reviewsQuery);
        
        // Variables for statistics
        let totalReviews = 0;
        let totalScore = 0;
        let starCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        let reviewsHTML = "";

        // Loop through every review
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const rating = data.rating || 0;
            
            // Update Stats
            totalReviews++;
            totalScore += rating;
            
            // Count stars for the progress bars
            // (Math.round handles cases where rating might be 4.5)
            const roundedRating = Math.round(rating);
            if (starCounts[roundedRating] !== undefined) {
                starCounts[roundedRating]++;
            }

            // Format the Timestamp (e.g. "6 Feb 2026")
            let dateString = "Recently";
            if (data.createdAt && data.createdAt.seconds) {
                const date = new Date(data.createdAt.seconds * 1000);
                dateString = date.toLocaleDateString("en-GB", {
                    day: "numeric", month: "short", year: "numeric"
                });
            }

            // Determine Author Name (Check for anonymous flag)
            const authorDisplay = data.anonymous ? "Anonymous" : (data.author || "Guest");

            // Build the HTML Card
            reviewsHTML += `
                <div class="review-card">
                    <div class="review-header">
                        <div class="review-stars">
                            ${generateStarsHTML(rating)}
                        </div>
                        <span class="review-date">${dateString}</span>
                    </div>
                    <div class="review-body">
                        <strong>${data.title || ""}</strong>
                        <p class="review-text">"${data.description || ""}"</p>
                    </div>
                    <p style="text-align: right; font-size: 0.85rem; color: #749EC1; margin-top: 10px;">
                        — ${authorDisplay}
                    </p>
                </div>
            `;
        });

        // 5. Update the DOM
        if (totalReviews > 0) {
            // Calculate Average
            const average = (totalScore / totalReviews).toFixed(1);
            
            // Update Overview Numbers
            avgScoreElement.textContent = average;
            totalCountElement.textContent = totalReviews;
            
            // Update the main big stars
            updateMainStars(average);

            // Update the Progress Bars
            updateProgressBars(starCounts, totalReviews);

            // Inject the Review Cards
            reviewsContainer.innerHTML = reviewsHTML;
        } else {
            reviewsContainer.innerHTML = `<p style="text-align:center; color:#555;">No reviews found.</p>`;
            avgScoreElement.textContent = "0.0";
            totalCountElement.textContent = "0";
        }

    } catch (error) {
        console.error("Error getting reviews:", error);
        reviewsContainer.innerHTML = `<p style="color: red; text-align:center;">Failed to load reviews. Check console for details.</p>`;
    }
}

// --- Helper Functions ---

// Generate the star icons string (★ ★ ★ ☆ ☆)
function generateStarsHTML(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            html += `<span class="star filled">★</span>`;
        } else {
            html += `<span class="star">★</span>`;
        }
    }
    return html;
}

// Update the big 5 stars under the "4.8" text
function updateMainStars(average) {
    const mainStarsContainer = document.querySelector('.average-rating .stars');
    if (mainStarsContainer) {
        mainStarsContainer.innerHTML = generateStarsHTML(Math.round(average));
    }
}

// Update the 5 progress bars in the breakdown
function updateProgressBars(counts, total) {
    for (let i = 1; i <= 5; i++) {
        const percentage = (counts[i] / total) * 100;
        
        // Select the bar div (e.g. .level-5)
        const barFill = document.querySelector(`.level-${i}`);
        
        // Select the count text span (next to the bar)
        // Structure: .rating-row > span > bar-container > span.count
        // We find the .level-X, go up to .bar-container, then next sibling is the count
        if (barFill) {
            barFill.style.width = `${percentage}%`;
            
            const countSpan = barFill.parentElement.nextElementSibling;
            if (countSpan) {
                countSpan.textContent = counts[i];
            }
        }
    }
}

// Load data when page is ready
window.addEventListener('DOMContentLoaded', loadCustomerSatisfaction);