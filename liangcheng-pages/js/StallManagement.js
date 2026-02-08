import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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
const vendorName = localStorage.getItem("vendorName");

// Redirect if not logged in
if (!vendorId) {
    alert("You are not logged in! Redirecting...");
    window.location.href = "../jayden-frames/v-login.html"; 
    throw new Error("No vendor ID found."); 
}

// Update Welcome Message
if (vendorName) {
    const welcomeMsg = document.getElementById("welcome-text");
    if(welcomeMsg) welcomeMsg.textContent = `Welcome! ${vendorName}`;
}

const MENU_COLLECTION = `vendor/${vendorId}/stallMenu`; 

// DOM ELEMENTS
const menuContainer = document.getElementById('menu-container');
const dishModal = document.getElementById('dish-modal');
const dishForm = document.getElementById('dish-form');
const modalTitle = document.getElementById('modal-title');
let currentMenuData = [];

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

// MENU FUNCTIONS (Fetch & Render)
async function fetchAndRenderMenu() {
    try {
        const querySnapshot = await getDocs(collection(db, MENU_COLLECTION));
        
        menuContainer.innerHTML = '';
        currentMenuData = [];

        querySnapshot.forEach((docSnapshot) => {
            const data = docSnapshot.data();
            const dish = {
                id: docSnapshot.id,
                name: data.name || "Unnamed Dish",
                price: data.price || "0.00",
                image: data.image || "https://placehold.co/300x200?text=No+Image",
                // Read availability (default to true if missing)
                available: data.available !== false 
            };
            currentMenuData.push(dish);
            createDishCard(dish);
        });

        // Add "Add New" Button Card
        const addCard = document.createElement('div');
        addCard.className = 'menu-box add-new-box';
        addCard.innerHTML = `
            <button id="add-btn" onclick="window.openModal()">
                <span id="plus">+</span>
            </button>
            <h4>Add New Menu Item</h4>
        `;
        menuContainer.appendChild(addCard);

    } catch (error) {
        console.error("Error loading menu:", error);
        alert(`Failed to load menu: ${error.message}`);
    }
}

function createDishCard(dish) {
    const card = document.createElement('div');
    card.className = 'menu-box';
    const fallbackImage = "https://placehold.co/300x200?text=No+Image";

    card.innerHTML = `
        <h3>${dish.name}</h3>
        <div class="image-placeholder">
            <img src="${dish.image}" alt="${dish.name}" onerror="this.onerror=null; this.src='${fallbackImage}';">
        </div>
        
        <div class="toggle-checkbox">
            <input type="checkbox" 
                   id="check-${dish.id}" 
                   ${dish.available ? 'checked' : ''} 
                   onchange="window.toggleAvailability('${dish.id}', this.checked)">
            <span class="status-text" id="text-${dish.id}">
                ${dish.available ? 'Available' : 'Unavailable'}
            </span>
        </div>

        <div class="details">
            <p>Price: <strong>$${dish.price}</strong></p>
        </div>
        <div class="card-actions">
            <button class="btn-edit" onclick="window.editDish('${dish.id}')">Edit</button>
            <button class="btn-delete" onclick="window.deleteDish('${dish.id}')">Delete</button>
        </div>
    `;
    
    menuContainer.appendChild(card);
}

// MENU ACTIONS (Add, Edit, Toggle, Delete)

// Toggle Availability
window.toggleAvailability = async function(id, isChecked) {
    try {
        const docRef = doc(db, MENU_COLLECTION, id);
        await updateDoc(docRef, { available: isChecked });
        
        // Update text
        const statusText = document.getElementById(`text-${id}`);
        if(statusText) statusText.textContent = isChecked ? 'Available' : 'Unavailable';
        
    } catch (error) {
        console.error("Error updating status:", error);
        alert("Failed to update status.");
        // Revert checkbox
        document.getElementById(`check-${id}`).checked = !isChecked;
    }
}

// Modal Functions
window.openModal = function() {
    dishForm.reset();
    document.getElementById('dish-id').value = "";
    modalTitle.innerText = "Add New Dish";
    dishModal.classList.remove('hidden');
}

window.editDish = function(id) {
    const dish = currentMenuData.find(item => item.id === id);
    if (!dish) return;

    document.getElementById('dish-id').value = dish.id;
    document.getElementById('dish-name').value = dish.name;
    document.getElementById('dish-price').value = dish.price;
    document.getElementById('dish-img').value = dish.image;
    
    modalTitle.innerText = "Edit Dish";
    dishModal.classList.remove('hidden');
}

window.closeModal = function() {
    dishModal.classList.add('hidden');
}

// Save (Add or Update)
dishForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('dish-id').value;
    const name = document.getElementById('dish-name').value;
    const price = document.getElementById('dish-price').value;
    const image = document.getElementById('dish-img').value;

    const dishData = { name, price, image };
    // New dishes default to available
    if(!id) dishData.available = true;

    try {
        if (id) {
            const docRef = doc(db, MENU_COLLECTION, id);
            await updateDoc(docRef, dishData);
            alert("Dish updated!");
        } else {
            await addDoc(collection(db, MENU_COLLECTION), dishData);
            alert("New dish added!");
        }
        closeModal();
        fetchAndRenderMenu();

    } catch (error) {
        console.error("Error saving dish:", error);
        alert("Error saving data: " + error.message);
    }
});

// Delete
window.deleteDish = async function(id) {
    if (confirm("Delete this dish?")) {
        try {
            await deleteDoc(doc(db, MENU_COLLECTION, id));
            alert("Dish deleted.");
            fetchAndRenderMenu();
        } catch (error) {
            console.error("Error deleting:", error);
            alert("Delete failed: " + error.message);
        }
    }
}

// QUEUE MANAGEMENT LOGIC (Static UI)
const queueList = document.getElementById('queue-list');

if (queueList) {
    queueList.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const button = e.target;
            const actionDiv = button.closest('.status-actions');
            const statusSpan = actionDiv.querySelector('.order-status');
            const btnGroup = actionDiv.querySelector('.btn-group');

            // Handle Accept
            if (button.classList.contains('btn-accept')) {
                statusSpan.textContent = "Accepted Order.";
                statusSpan.style.color = "green";
                button.style.display = 'none';
                btnGroup.querySelector('.btn-decline').style.display = 'none';
                btnGroup.querySelector('.btn-ready').style.display = 'inline-block';
            }

            // Handle Decline
            else if (button.classList.contains('btn-decline')) {
                if(confirm("Decline this order?")) {
                    const row = button.closest('tr');
                    row.style.opacity = "0.5";
                    statusSpan.textContent = "Declined Order.";
                    statusSpan.style.color = "red";
                    btnGroup.querySelector('.btn-decline').style.display = 'none';
                    btnGroup.querySelector('.btn-accept').style.display = 'none';
                }
            }

            // Handle Ready
            else if (button.classList.contains('btn-ready')) {
                statusSpan.textContent = "Order Ready for Collection";
                statusSpan.style.color = "blue";
                btnGroup.querySelector('.btn-ready').style.display = 'none';
            }
        }
    });
}

// START APP
fetchAndRenderMenu();