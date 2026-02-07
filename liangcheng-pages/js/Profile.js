// --- 1. IMPORT FIREBASE FUNCTIONS (CDN URLs for Browser Use) ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// --- 2. YOUR FIREBASE CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyDTYTjyaAt1FwKbHmZX1A1kiayskiFRBUw",
  authDomain: "fed-assignment-f0cd8.firebaseapp.com",
  projectId: "fed-assignment-f0cd8",
  storageBucket: "fed-assignment-f0cd8.firebasestorage.app",
  messagingSenderId: "114542382438",
  appId: "1:114542382438:web:3227de541d821031004ca7",
  measurementId: "G-VDMMRF2WE5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// --- 3. MAIN PROFILE LOGIC ---
document.addEventListener("DOMContentLoaded", async () => {

    // HARDCODED VENDOR ID (Matches your Firestore Document ID)
    // In the future, this should come from the logged-in user.
    const VENDOR_DOC_ID = "S1234567B"; 
    
    // Reference to: Collection "vendor" -> Document "S1234567B"
    const vendorRef = doc(db, "vendor", VENDOR_DOC_ID);

    // --- FUNCTION: LOAD DATA ---
    async function loadProfile() {
        console.log("Fetching data for:", VENDOR_DOC_ID);
        try {
            const docSnap = await getDoc(vendorRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                console.log("Data found:", data);
                
                // Update HTML elements
                
                // 1. Name
                if(document.getElementById("name-display")) {
                    document.getElementById("name-display").textContent = data.name;
                    document.getElementById("name-input").value = data.name;
                    // Update the "Welcome! Vendor" header if it exists
                    const headerName = document.getElementById("header-name") || document.querySelector(".welcome-msg h2");
                    if(headerName) headerName.textContent = "Welcome! " + data.name;
                }

                // 2. NRIC
                if(document.getElementById("nric-display")) {
                    document.getElementById("nric-display").textContent = data.nric;
                }

                // 3. Contact (Field: contactNumber)
                if(document.getElementById("contact-display")) {
                    document.getElementById("contact-display").textContent = data.contactNumber;
                    document.getElementById("contact-input").value = data.contactNumber;
                }

                // 4. Email (Field: emailAddress)
                if(document.getElementById("email-display")) {
                    document.getElementById("email-display").textContent = data.emailAddress;
                    document.getElementById("email-input").value = data.emailAddress;
                }

                // 5. Location (Field: stallLocation)
                if(document.getElementById("location-display")) {
                    document.getElementById("location-display").textContent = data.stallLocation;
                    document.getElementById("location-input").value = data.stallLocation;
                }

                // 6. Password
                if(document.getElementById("password-input")) {
                    document.getElementById("password-input").value = data.password;
                }

            } else {
                console.log("No such document!");
                alert("Vendor profile not found. Check your Internet or Database ID.");
            }
        } catch (error) {
            console.error("Error getting document:", error);
            alert("Error loading profile: " + error.message);
        }
    }

    // Load data immediately
    loadProfile();

    // --- FUNCTION: HANDLE EDIT/SAVE ---
    const editButtons = document.querySelectorAll(".edit-btn");

    editButtons.forEach(btn => {
        btn.addEventListener("click", async () => {
            const fieldDiv = btn.closest(".info-field");
            const textSpan = fieldDiv.querySelector(".info-text");
            const input = fieldDiv.querySelector(".info-input");
            
            // Get the database field name from HTML (data-field="...")
            const fieldName = btn.getAttribute("data-field");
            const isPassword = fieldName === "password";

            // --- EDIT MODE ---
            if (btn.textContent === "Edit") {
                textSpan.style.display = "none";
                input.style.display = "block";
                
                // Reveal password text for editing
                if (isPassword) {
                    input.type = "text"; 
                }

                input.focus();
                btn.textContent = "Save";
            } 
            
            // --- SAVE MODE ---
            else {
                const newValue = input.value;
                const originalText = btn.textContent;
                btn.textContent = "Saving...";
                btn.disabled = true; // Prevent double clicking

                try {
                    // Create update object
                    const updateData = {};
                    updateData[fieldName] = newValue;

                    // Send to Firebase
                    await updateDoc(vendorRef, updateData);

                    // Update UI on success
                    if (isPassword) {
                        textSpan.textContent = "••••••••"; 
                        input.type = "password"; // Hide again
                    } else {
                        textSpan.textContent = newValue;
                    }

                    textSpan.style.display = "block";
                    input.style.display = "none";
                    btn.textContent = "Edit";
                    
                    console.log("Updated successfully!");

                } catch (error) {
                    console.error("Error updating document: ", error);
                    alert("Failed to save. Check console for details.");
                    btn.textContent = "Save"; // Revert button so they can try again
                } finally {
                    btn.disabled = false;
                }
            }
        });
    });
});