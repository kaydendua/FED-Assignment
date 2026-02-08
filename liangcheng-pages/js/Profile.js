import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

const vendorRef = doc(db, "vendor", vendorId);

// MAIN LOGIC
document.addEventListener("DOMContentLoaded", async () => {

    // Logout Logic
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (confirm("Are you sure you want to logout?")) {
                localStorage.clear();
                window.location.href = "../jayden-frames/v-login.html";
            }
        });
    }

    // Load Profile Data
    async function loadProfile() {
        try {
            const docSnap = await getDoc(vendorRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                
                // Header
                const headerName = document.getElementById("header-name");
                if (headerName) headerName.textContent = data.name;

                // Editable Fields
                updateField("name", data.name);
                updateField("contact", data.contactNumber); 

                // Read-Only Fields (Just Text)
                document.getElementById("nric-display").textContent = data.nric || "N/A";
                document.getElementById("email-display").textContent = data.email || data.emailAddress || "N/A";
                document.getElementById("location-display").textContent = data.location || data.stallLocation || "N/A";

                // Password (Special Handling)
                const pwDisplay = document.getElementById("password-display");
                pwDisplay.textContent = "••••••••"; // Default Mask
                pwDisplay.dataset.realPassword = data.password; // Store real password secretly in HTML
                
            } else {
                alert("Vendor profile not found.");
            }
        } catch (error) {
            console.error("Error loading:", error);
        }
    }

    function updateField(prefix, value) {
        const display = document.getElementById(`${prefix}-display`);
        const input = document.getElementById(`${prefix}-input`);
        if (display) display.textContent = value || "";
        if (input) input.value = value || "";
    }

    loadProfile();

    // PASSWORD SHOW/HIDE LOGIC
    const toggleBtn = document.getElementById("toggle-pw-btn");
    
    toggleBtn.addEventListener("click", () => {
        const pwDisplay = document.getElementById("password-display");
        const realPassword = pwDisplay.dataset.realPassword;

        if (pwDisplay.textContent === "••••••••") {
            // Show Password
            pwDisplay.textContent = realPassword;
            toggleBtn.textContent = "Hide";
        } else {
            // Hide Password
            pwDisplay.textContent = "••••••••";
            toggleBtn.textContent = "Show";
        }
    });

    // EDIT/SAVE LOGIC (Only for Name & Contact)
    const editButtons = document.querySelectorAll(".edit-btn");

    editButtons.forEach(btn => {
        btn.addEventListener("click", async () => {
            const fieldDiv = btn.closest(".info-field");
            const textSpan = fieldDiv.querySelector(".info-text");
            const input = fieldDiv.querySelector(".info-input");
            const fieldName = btn.getAttribute("data-field");

            // Edit Mode
            if (btn.textContent === "Edit") {
                textSpan.style.display = "none";
                input.style.display = "block";
                input.focus();
                btn.textContent = "Save";
            } 
            // Save Mode
            else {
                const newValue = input.value;
                btn.textContent = "Saving...";
                btn.disabled = true;

                try {
                    const updateData = {};
                    updateData[fieldName] = newValue;

                    await updateDoc(vendorRef, updateData);

                    textSpan.textContent = newValue;
                    if (fieldName === "name") {
                        document.getElementById("header-name").textContent = newValue;
                        localStorage.setItem("vendorName", newValue);
                    }

                    textSpan.style.display = "block";
                    input.style.display = "none";
                    btn.textContent = "Edit";

                } catch (error) {
                    console.error("Error updating:", error);
                    alert("Failed to save.");
                    btn.textContent = "Save";
                } finally {
                    btn.disabled = false;
                }
            }
        });
    });
});