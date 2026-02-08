import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

// LOGOUT LOGIC
const logoutBtn = document.getElementById("logout-btn");
if(logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
        if(confirm("Logout?")) {
            localStorage.clear();
            window.location.href = "../jayden-frames/v-login.html";
        }
    });
}

// MAIN LOGIC
document.addEventListener("DOMContentLoaded", async function () {

    // Bar Graph
    const ctx = document.getElementById('salesChart').getContext('2d');

    // Create a gradient for the bars
    let gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, '#4988BB');
    gradient.addColorStop(1, '#749ec16e');

    const ctxBestSelling = document.getElementById('bestSellingChart').getContext('2d');
    
    new Chart(ctxBestSelling, {
        type: 'doughnut',
        data: {
            labels: ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'],
            datasets: [{
                data: [30, 15, 20, 10, 25], 
                backgroundColor: ['#bbdefb', '#ffcc80', '#f8bbd0', '#b9f6ca', '#e1bee7'],
                borderWidth: 1,
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'left',
                    labels: { font: { size: 14 }, boxWidth: 20, padding: 20 }
                }
            },
            layout: { padding: 20 }
        }
    });

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Sales Revenue ($)',
                data: [4500, 3550, 4700, 4850, 4200, 4100, 4450, 3950, 4850, 4250, 3900, 4900],
                backgroundColor: gradient,
                borderWidth: 0,
                barPercentage: 0.7,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { display: false }, tooltip: { enabled: true } },
            scales: {
                y: {
                    beginAtZero: true, max: 5000,
                    ticks: { stepSize: 500, font: { size: 10 } },
                    grid: { color: '#e5e5e5', borderDash: [5, 5] }
                },
                x: { grid: { display: false } }
            }
        }
    });

    // ==========================================
    // DYNAMIC FIREBASE DATA
    try {
        const docRef = doc(db, "vendor", vendorId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();

            // Update Welcome Message
            const nameEl = document.getElementById("header-name");
            if (nameEl) nameEl.textContent = data.name || "Vendor";

            // Update Hygiene Grade
            const gradeEl = document.getElementById("hygiene-grade-display");
            if (gradeEl) gradeEl.textContent = data.hygieneGrade || "-";
            
        } else {
            console.log("No vendor profile found!");
        }
    } catch (error) {
        console.error("Error fetching vendor data:", error);
    }

});