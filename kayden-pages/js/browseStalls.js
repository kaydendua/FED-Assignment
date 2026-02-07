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

const placeholder = document.getElementById("placeholder");
const loadingIndicator = document.getElementById("loading-indicator");
const endMessage = document.getElementById("end-message");

function getHawkerIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

const hawkerId = getHawkerIdFromUrl();