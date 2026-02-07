// js/c-menu.js (MODULE)
// Loads vendor menu from Firestore: vendor/{vendorId}/stallMenu/{itemId}
// Cart stored in localStorage

import { db } from "../../firebase/firebase.js";
import {
  doc,
  getDoc,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

console.log("c-menu.js loaded ✅");

// -----------------------
// CONFIG
// -----------------------
const MENU_SUBCOLLECTION = "stallMenu"; // change if yours is different

// -----------------------
// Helpers
// -----------------------
function money(n) {
  const num = Number(n || 0);
  return `$${num.toFixed(2)}`;
}

function safeText(v, fallback = "") {
  if (v === undefined || v === null) return fallback;
  return String(v);
}

function getVendorId() {
  // Prefer vendor chosen by customer (recommended)
  const qp = new URLSearchParams(window.location.search);
  return (
    qp.get("vendorId") ||
    localStorage.getItem("selectedVendorId") || // recommended key
    localStorage.getItem("vendorId") ||         // if you reused vendor login key
    ""
  );
}

function readCart() {
  try {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  } catch {
    return [];
  }
}

function writeCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function cartCount(cart) {
  return cart.reduce((sum, i) => sum + (Number(i.qty) || 0), 0);
}

function cartTotal(cart) {
  return cart.reduce((sum, i) => sum + (Number(i.price) || 0) * (Number(i.qty) || 0), 0);
}

function findImage(data) {
  // supports different field names
  return (
    data.imageUrl ||
    data.imageURL ||
    data.imgUrl ||
    data.img ||
    data.image ||
    ""
  );
}

function findName(data) {
  return data.foodName || data.itemName || data.name || "Untitled item";
}

function findPrice(data) {
  // supports number or string
  const p = data.price ?? data.itemPrice ?? data.cost ?? 0;
  const num = Number(p);
  return Number.isFinite(num) ? num : 0;
}

// -----------------------
// DOM
// -----------------------
const grid = document.getElementById("menu-grid");
const emptyMsg = document.getElementById("menu-empty");

const vendorNameEl = document.getElementById("menu-vendor-name");
const vendorLocEl = document.getElementById("menu-vendor-location");

const cartBtn = document.getElementById("menu-cart-btn");
const cartCountEl = document.getElementById("menu-cart-count");

const cartPanel = document.getElementById("cart-panel");
const cartCloseBtn = document.getElementById("cart-close-btn");
const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const cartClearBtn = document.getElementById("cart-clear-btn");
const cartCheckoutBtn = document.getElementById("cart-checkout-btn");

// -----------------------
// Cart UI
// -----------------------
function renderCart() {
  const cart = readCart();
  cartCountEl.textContent = cartCount(cart);
  cartTotalEl.textContent = money(cartTotal(cart));

  cartItemsEl.innerHTML = "";

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `<p style="margin:0;color:#333;font-size:13px;">Cart is empty.</p>`;
    return;
  }

  cart.forEach((item) => {
    const row = document.createElement("div");
    row.className = "cart-item";

    const img = document.createElement("img");
    img.className = "cart-item-img";
    img.alt = safeText(item.name);
    img.src = item.imageUrl || "";
    img.onerror = () => { img.style.display = "none"; };

    const mid = document.createElement("div");
    mid.className = "cart-item-mid";

    const name = document.createElement("p");
    name.className = "cart-item-name";
    name.textContent = safeText(item.name);

    const meta = document.createElement("div");
    meta.className = "cart-item-meta";

    const minus = document.createElement("button");
    minus.className = "qty-btn";
    minus.type = "button";
    minus.textContent = "−";
    minus.addEventListener("click", () => changeQty(item.itemId, -1));

    const qty = document.createElement("span");
    qty.textContent = `Qty: ${item.qty}`;

    const plus = document.createElement("button");
    plus.className = "qty-btn";
    plus.type = "button";
    plus.textContent = "+";
    plus.addEventListener("click", () => changeQty(item.itemId, +1));

    const price = document.createElement("span");
    price.textContent = money(item.price);

    const remove = document.createElement("button");
    remove.className = "remove-btn";
    remove.type = "button";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => removeItem(item.itemId));

    meta.appendChild(minus);
    meta.appendChild(qty);
    meta.appendChild(plus);
    meta.appendChild(price);
    meta.appendChild(remove);

    mid.appendChild(name);
    mid.appendChild(meta);

    row.appendChild(img);
    row.appendChild(mid);

    cartItemsEl.appendChild(row);
  });
}

function addToCart({ vendorId, itemId, name, price, imageUrl }) {
  const cart = readCart();

  // Force single-vendor cart (optional but usually needed)
  const existingVendor = cart[0]?.vendorId;
  if (existingVendor && existingVendor !== vendorId) {
    const ok = confirm("Your cart has items from another vendor. Clear cart and add this item?");
    if (!ok) return;
    writeCart([]);
  }

  const updated = readCart();
  const idx = updated.findIndex((x) => x.itemId === itemId);

  if (idx >= 0) {
    updated[idx].qty += 1;
  } else {
    updated.push({
      vendorId,
      itemId,
      name,
      price,
      qty: 1,
      imageUrl: imageUrl || ""
    });
  }

  writeCart(updated);
  renderCart();
}

function changeQty(itemId, delta) {
  const cart = readCart();
  const idx = cart.findIndex((x) => x.itemId === itemId);
  if (idx < 0) return;

  cart[idx].qty = (cart[idx].qty || 0) + delta;

  if (cart[idx].qty <= 0) {
    cart.splice(idx, 1);
  }

  writeCart(cart);
  renderCart();
}

function removeItem(itemId) {
  const cart = readCart().filter((x) => x.itemId !== itemId);
  writeCart(cart);
  renderCart();
}

// -----------------------
// Cart panel events
// -----------------------
cartBtn?.addEventListener("click", () => {
  cartPanel.classList.add("open");
  cartPanel.setAttribute("aria-hidden", "false");
  renderCart();
});

cartCloseBtn?.addEventListener("click", () => {
  cartPanel.classList.remove("open");
  cartPanel.setAttribute("aria-hidden", "true");
});

cartPanel?.addEventListener("click", (e) => {
  // click outside closes
  if (e.target === cartPanel) {
    cartPanel.classList.remove("open");
    cartPanel.setAttribute("aria-hidden", "true");
  }
});

cartClearBtn?.addEventListener("click", () => {
  writeCart([]);
  renderCart();
});

cartCheckoutBtn?.addEventListener("click", () => {
  // Go to your checkout page
  window.location.href = "c-checkout.html";
});

// -----------------------
// Load menu from Firestore
// -----------------------
async function loadMenu() {
  const vendorId = getVendorId();

  if (!vendorId) {
    emptyMsg.style.display = "block";
    emptyMsg.textContent = "No vendor selected. Pass vendorId in URL (?vendorId=...) or set localStorage selectedVendorId.";
    return;
  }

  // Store current vendor for later pages
  localStorage.setItem("selectedVendorId", vendorId);

  // 1) Vendor info (optional)
  try {
    const vendorSnap = await getDoc(doc(db, "vendor", vendorId));
    if (vendorSnap.exists()) {
      const v = vendorSnap.data();
      vendorNameEl.textContent = v.name || v.stallName || `Vendor: ${vendorId}`;
      vendorLocEl.textContent = v.stallLocation || v.location || "";
    } else {
      vendorNameEl.textContent = `Vendor: ${vendorId}`;
    }
  } catch (e) {
    console.warn("Vendor doc read failed:", e);
    vendorNameEl.textContent = `Vendor: ${vendorId}`;
  }

  // 2) Menu items from subcollection
  grid.innerHTML = "";
  emptyMsg.style.display = "none";

  try {
    const menuRef = collection(db, "vendor", vendorId, MENU_SUBCOLLECTION);
    const menuSnap = await getDocs(menuRef);

    if (menuSnap.empty) {
      emptyMsg.style.display = "block";
      emptyMsg.textContent = "No menu items found.";
      return;
    }

    menuSnap.forEach((docSnap) => {
      const data = docSnap.data();
      const itemId = docSnap.id;

      const name = findName(data);
      const price = findPrice(data);
      const imageUrl = findImage(data);

      const card = document.createElement("article");
      card.className = "menu-card";

      const img = document.createElement("img");
      img.className = "menu-img";
      img.alt = name;
      img.src = imageUrl || "";
      img.onerror = () => {
        // fallback if missing/bad URL
        img.src = "";
        img.style.display = "none";
      };

      const body = document.createElement("div");
      body.className = "menu-card-body";

      const h = document.createElement("h3");
      h.className = "menu-name";
      h.textContent = name;

      const row = document.createElement("div");
      row.className = "menu-price-row";

      const p = document.createElement("span");
      p.className = "menu-price";
      p.textContent = money(price);

      const btn = document.createElement("button");
      btn.className = "menu-add-btn";
      btn.type = "button";
      btn.textContent = "Add to cart";
      btn.addEventListener("click", () => {
        addToCart({ vendorId, itemId, name, price, imageUrl });
      });

      row.appendChild(p);
      row.appendChild(btn);

      body.appendChild(h);
      body.appendChild(row);

      if (imageUrl) card.appendChild(img);
      card.appendChild(body);

      grid.appendChild(card);
    });

  } catch (err) {
    console.error("Menu load error:", err);
    emptyMsg.style.display = "block";
    emptyMsg.textContent = "Failed to load menu. Check console + Firestore rules.";
  }
}

// Init
renderCart();
loadMenu();
