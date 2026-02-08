import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, where, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// CONFIGURATION & SETUP
const firebaseConfig = {
    apiKey: "AIzaSyDTYTjyaAt1FwKbHmZX1A1kiayskiFRBUw",
    authDomain: "fed-assignment-f0cd8.firebaseapp.com",
    projectId: "fed-assignment-f0cd8",
    storageBucket: "fed-assignment-f0cd8.firebasestorage.app",
    messagingSenderId: "114542382438",
    appId: "1:114542382438:web:3227de541d821031004ca7",
    measurementId: "G-VDMMRF2WE5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// AUTHENTICATION & PATHS
const vendorId = localStorage.getItem("vendorId");

if (!vendorId) {
    window.location.href = "../jayden-frames/v-login.html"; 
    throw new Error("No vendor ID found.");
}

// MAIN LOGIC
document.addEventListener("DOMContentLoaded", async () => {
    
    // Logout Logic
    const logoutBtn = document.getElementById("logout-btn");
    if(logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if(confirm("Are you sure you want to logout?")) {
                localStorage.clear();
                window.location.href = "../jayden-frames/v-login.html";
            }
        });
    }

    // FETCH VENDOR DETAILS (Name & Stall ID)
    let currentStallId = null;

    try {
        const vendorSnap = await getDoc(doc(db, "vendor", vendorId));
        
        if(vendorSnap.exists()) {
            const data = vendorSnap.data();
            
            // Update Welcome Name
            document.getElementById("header-name").textContent = data.name || "Vendor";
            
            // Get the Stall ID (Important!)
            currentStallId = data.stallId; 
            console.log("Found Stall ID:", currentStallId); // Debugging

            if (currentStallId) {
                loadReviews(currentStallId);
            } else {
                console.error("Vendor has no stallId field!");
                document.getElementById("reviews-list").innerHTML = "<p>Error: No Stall ID linked to this vendor.</p>";
            }

        } else {
            console.error("Vendor profile not found");
        }
    } catch(e) { 
        console.error("Error fetching vendor:", e); 
    }


    // FETCH REVIEWS (Using Stall ID)
    async function loadReviews(stallId) {
        const reviewsList = document.getElementById("reviews-list");
        
        try {
            // Query: Get reviews where 'stallId' matches the vendor's stallId
            const q = query(collection(db, "reviews"), where("stallId", "==", stallId));
            const querySnapshot = await getDocs(q);

            const reviews = [];
            // Stats Variables
            let totalRating = 0;
            const counts = { 5:0, 4:0, 3:0, 2:0, 1:0 };

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                reviews.push(data);
                
                // Track stats
                const r = Number(data.rating) || 0;
                totalRating += r;
                if(counts[r] !== undefined) counts[r]++;
            });

            // UPDATE OVERVIEW
            const totalReviews = reviews.length;
            document.getElementById("total-count").textContent = totalReviews;

            if (totalReviews > 0) {
                // Calculate Average
                const average = (totalRating / totalReviews).toFixed(1);
                document.getElementById("avg-score").textContent = average;
                renderMainStars(average);

                // Update Bars
                for (let i = 5; i >= 1; i--) {
                    const count = counts[i];
                    const percentage = (count / totalReviews) * 100;
                    
                    const countEl = document.getElementById(`count-${i}`);
                    const barEl = document.getElementById(`bar-${i}`);
                    
                    if(countEl) countEl.textContent = count;
                    if(barEl) barEl.style.width = `${percentage}%`;
                }
            } else {
                document.getElementById("avg-score").textContent = "0.0";
                renderMainStars(0);
            }

            // RENDER REVIEW LIST
            reviewsList.innerHTML = ""; // Clear "Loading..."

            if (reviews.length === 0) {
                reviewsList.innerHTML = `<p style="text-align:center;">No reviews found for Stall ID: ${stallId}</p>`;
                return;
            }

            // Sort locally (if 'createdAt' is a Timestamp, convert to Date)
            reviews.sort((a, b) => {
                const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
                const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
                return dateB - dateA; // Newest first
            });

            reviews.forEach(review => {
                const card = document.createElement("div");
                card.className = "review-card";
                
                // Format Date
                let dateStr = "Unknown Date";
                if (review.createdAt) {
                    // Handle Firestore Timestamp
                    const dateObj = review.createdAt.toDate ? review.createdAt.toDate() : new Date(review.createdAt);
                    dateStr = dateObj.toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' });
                }

                // Generate Stars for this specific review
                let starHTML = "";
                for(let i=0; i<5; i++) {
                    if(i < review.rating) starHTML += `<span class="star filled">★</span>`;
                    else starHTML += `<span class="star">★</span>`;
                }

                card.innerHTML = `
                    <div class="review-header">
                        <span class="reviewer-name">${review.author || "Guest"}</span>
                        <span class="review-date">${dateStr}</span>
                    </div>
                    <div class="review-stars">
                        ${starHTML}
                    </div>
                    <p class="review-text"><strong>${review.title || ""}</strong><br>${review.description || "No comment."}</p>
                `;
                reviewsList.appendChild(card);
            });

        } catch (error) {
            console.error("Error fetching reviews:", error);
            reviewsList.innerHTML = `<p style="color:red; text-align:center;">Error loading reviews: ${error.message}</p>`;
        }
    }

    // Helper: Render the big stars in the summary box
    function renderMainStars(score) {
        const container = document.getElementById("avg-stars");
        if(!container) return;
        container.innerHTML = "";
        
        for (let i = 1; i <= 5; i++) {
            const span = document.createElement("span");
            span.className = "star";
            span.textContent = "★";
            if (i <= Math.round(score)) {
                span.classList.add("filled");
            }
            container.appendChild(span);
        }
    }
});