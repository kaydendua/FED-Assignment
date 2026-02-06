import { db, getCurrentUser } from "/firebase/firebase.js";
import {
    collection,
    getDocs,
    query,
    where,
    documentId
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";