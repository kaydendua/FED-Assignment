import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// --- 1. CONFIGURATION ---
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

// --- 2. AUTHENTICATION CHECK ---
const vendorId = localStorage.getItem("vendorId");

if (!vendorId) {
    alert("You are not logged in! Redirecting...");
    window.location.href = "../jayden-frames/v-login.html"; // Adjust path if needed
    throw new Error("No vendor ID found.");
}

// Reference to the Vendor's Document
const vendorRef = doc(db, "vendor", vendorId);


// --- 3. MAIN LOGIC ---
document.addEventListener("DOMContentLoaded", async () => {

    // --- LOGOUT LOGIC ---
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

    // --- FUNCTION: LOAD DATA ---
    async function loadProfile() {
        console.log("Fetching profile for:", vendorId);
        try {
            const docSnap = await getDoc(vendorRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                
                // 1. Update Header Name
                const headerName = document.getElementById("header-name");
                if (headerName) headerName.textContent = data.name;

                // 2. Update Fields Helper Function
                updateField("name", data.name);
                updateField("nric", data.nric, true); // Read-only
                updateField("contact", data.contactNumber); // Note: DB field is contactNumber
                updateField("email", data.emailAddress || data.email); // Handle both namings
                updateField("location", data.stallLocation || data.location);
                updateField("password", data.password);

            } else {
                console.log("No such document!");
                alert("Vendor profile not found in database.");
            }
        } catch (error) {
            console.error("Error getting document:", error);
            alert("Error loading profile: " + error.message);
        }
    }

    // Helper to update HTML elements safely
    function updateField(prefix, value, isReadOnly = false) {
        const display = document.getElementById(`${prefix}-display`);
        const input = document.getElementById(`${prefix}-input`);
        
        if (display) display.textContent = value || "N/A";
        if (input) input.value = value || "";
    }

    // Load data immediately
    loadProfile();


    // --- FUNCTION: HANDLE EDIT/SAVE ---
    const editButtons = document.querySelectorAll(".edit-btn");

    editButtons.forEach(btn => {
        btn.addEventListener("click", async () => {
            // Find the parent container (info-field)
            const fieldDiv = btn.closest(".info-field");
            if (!fieldDiv) return; // Guard clause

            const textSpan = fieldDiv.querySelector(".info-text");
            const input = fieldDiv.querySelector(".info-input");
            
            // Get the database field name from HTML (data-field="...")
            const fieldName = btn.getAttribute("data-field");
            if (!fieldName) return; // Skip if no field name

            const isPassword = fieldName === "password";

            // --- EDIT MODE ---
            if (btn.textContent === "Edit") {
                textSpan.style.display = "none";
                input.style.display = "block";
                
                if (isPassword) {
                    input.type = "text"; // Show password while editing
                }

                input.focus();
                btn.textContent = "Save";
            } 
            
            // --- SAVE MODE ---
            else {
                const newValue = input.value;
                btn.textContent = "Saving...";
                btn.disabled = true;

                try {
                    // Create update object
                    const updateData = {};
                    updateData[fieldName] = newValue;

                    // Send to Firebase
                    await updateDoc(vendorRef, updateData);

                    // Update UI on success
                    if (isPassword) {
                        textSpan.textContent = "••••••••"; 
                        input.type = "password"; 
                    } else {
                        textSpan.textContent = newValue;
                    }

                    // Update Welcome Message if Name changed
                    if (fieldName === "name") {
                        const headerName = document.getElementById("header-name");
                        if (headerName) headerName.textContent = newValue;
                        // Also update localStorage so other pages see the new name
                        localStorage.setItem("vendorName", newValue);
                    }

                    textSpan.style.display = "block";
                    input.style.display = "none";
                    btn.textContent = "Edit";
                    alert("Profile updated!");

                } catch (error) {
                    console.error("Error updating:", error);
                    alert("Failed to save: " + error.message);
                    btn.textContent = "Save"; 
                } finally {
                    btn.disabled = false;
                }
            }
        });
    });
});