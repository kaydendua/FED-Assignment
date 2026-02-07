// 1. Import Firebase functions from the Web CDN
// We use these URLs because we aren't using a build tool like Webpack
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
const analytics = getAnalytics(app); // Optional: keeps analytics running
const db = getFirestore(app);        // REQUIRED: connects to your database

// 4. Function to Fetch and Display Reviews
async function loadReviews() {
    const reviewsList = document.getElementById('reviews-list');
    const avgScoreEl = document.getElementById('avg-score');
    const totalCountEl = document.getElementById('total-count');
    
    // Clear current dummy HTML
    reviewsList.innerHTML = ''; 

    try {
        // Query the 'reviews' collection, sorted by date (newest first)
        const q = query(collection(db, "reviews"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);

        let totalRating = 0;
        let count = 0;
        // Arrays to count stars [unused, 1s, 2s, 3s, 4s, 5s]
        let starCounts = [0, 0, 0, 0, 0, 0]; 

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            count++;
            
            // Safety check: ensure rating is a number
            const rating = Number(data.rating);
            totalRating += rating;
            
            if(rating >= 1 && rating <= 5) {
                starCounts[rating]++;
            }

            // Convert Timestamp to readable date
            let dateStr = "Recently";
            if (data.timestamp) {
                const dateObj = data.timestamp.toDate();
                dateStr = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
            }

            // Create Star HTML (using your text stars)
            let starHTML = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= rating) {
                    starHTML += '<span class="star filled">★</span>';
                } else {
                    starHTML += '<span class="star">★</span>';
                }
            }

            // Create the Review Card HTML
            const card = `
                <div class="review-card">
                    <div class="review-header">
                        <span class="customer-name">${data.customerName}</span>
                        <span class="review-date">${dateStr}</span>
                    </div>
                    <div class="review-stars">
                        ${starHTML}
                    </div>
                    <p class="review-text">${data.comment}</p>
                </div>
            `;
            reviewsList.innerHTML += card;
        });

        // 5. Update the Overview Panel (Average & Bars)
        if (count > 0) {
            // Update Average Score
            const average = (totalRating / count).toFixed(1);
            if(avgScoreEl) avgScoreEl.innerText = average;
            if(totalCountEl) totalCountEl.innerText = count;
            
            // Update the Progress Bars width dynamically
            // We find the elements by their class (e.g., .level-5)
            updateBar('level-5', starCounts[5], count);
            updateBar('level-4', starCounts[4], count);
            updateBar('level-3', starCounts[3], count);
            updateBar('level-2', starCounts[2], count);
            updateBar('level-1', starCounts[1], count);
        }

    } catch (error) {
        console.error("Error fetching reviews:", error);
        reviewsList.innerHTML = `<p style="padding:20px; color:red;">Failed to load reviews. Error: ${error.message}</p>`;
    }
}

// Helper function to update the CSS width of the bars
function updateBar(className, starCount, totalCount) {
    const bar = document.querySelector(`.${className}`);
    const countSpan = bar.parentElement.nextElementSibling; // The number next to the bar
    
    if (bar && totalCount > 0) {
        const percentage = (starCount / totalCount) * 100;
        bar.style.width = `${percentage}%`;
        if(countSpan) countSpan.innerText = starCount;
    }
}

// Run the function when page loads
window.addEventListener('DOMContentLoaded', loadReviews);