import { db } from '/firebase/firebase.js';
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  documentId
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

const stallsContainer = document.getElementById("stalls-container")
const placeholder = document.getElementById("placeholder");

function getHawkerIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('hId');
}

const hawkerId = getHawkerIdFromUrl();

async function loadStalls() {
    
    if (!hawkerId) {
        placeholder.textContent = "No hawker center selected"
        return;
    }

    const stallQuery = query(
        collection(db, "stalls"),
        where("hawkerCentre", "==", hawkerId)
    )
    const stallSnap = await getDocs(stallQuery);

    if (stallSnap.empty) {
        placeholder.textContent = "No stalls registered yet"
        return;
    }

    for (const stallDoc of stallSnap.docs) {
        displayStalls(stallDoc)
    }

    placeholder.hidden = true;
}

function displayStalls(stallDoc) {
    const card = document.createElement("div")
    card.className = "stall-card";

    const stall = stallDoc.data();
    const stallId = String(stallDoc.id || "");

    const photoUrl = stall.img || '/img/image-not-found.png';

    let averageRating = ""
    if (stall.reviewCount === 0) {
        averageRating = "N/A"
    } else {
        averageRating = `${stall.averageRating.toFixed(1)} ⭐`
    }

    card.innerHTML = `
        <div class="stall-image-container">
            <div class="transparent-gradient"></div>
            <img src="${photoUrl}" alt="Image Unavailable" class="stall-image">
        </div>
        <div class="stall-info">
            <div class="stall-info-header">
                <h3>${stall.name}</h3>
                <p>${averageRating}</p>
            </div>
            <p>${stall.description}</p>
        </div>
    `;

    card.addEventListener("click", ()=>{
        window.location.href = `stallPage.html?id=${stallId}`
    })

    stallsContainer.appendChild(card)
}

loadStalls();