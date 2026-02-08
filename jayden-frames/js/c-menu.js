// js/c-menu.js (MODULE)
// Loads vendor menu from Firestore: vendor/{vendorId}/stallMenu/{itemId}
// Supports linking by:
//   ✅ ?stallId=2  (vendor.stallId field, usually "1","2"...)
//   ✅ ?vendorId=VENDOR_DOC_ID
//   ✅ (NEW) if someone passes a stalls doc id by mistake, we convert it:
//        ?stallId=<STALLS_DOC_ID>  OR  ?id=<STALLS_DOC_ID>
// Cart stored in localStorage

import { db } from "../../firebase/firebase.js";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

console.log("c-menu.js loaded ✅");

// -----------------------
// CONFIG
// -----------------------
const MENU_SUBCOLLECTION = "stallMenu";

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

function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

/**
 * Find vendorId by vendor.stallId field (stored as string like "1","2")
 * vendor docs: { stallId: "2", ... }
 * returns vendor document id (vendorId)
 */
async function getVendorIdByStallId(stallId) {
  const stallIdStr = String(stallId);
  const q = query(collection(db, "vendor"), where("stallId", "==", stallIdStr));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].id;
}

/**
 * ✅ NEW: If someone passed stalls doc id instead of a real stallId,
 * convert stalls/{stallDocId} -> vendorId.
 *
 * stalls doc should contain either:
 *  - vendorId (best), OR
 *  - stallId (string like "1","2") which matches vendor.stallId
 */
async function getVendorIdFromStallsDoc(stallDocId) {
  try {
    const stallSnap = await getDoc(doc(db, "stalls", String(stallDocId)));
    if (!stallSnap.exists()) return null;

    const stall = stallSnap.data();

    if (stall.vendorId) return String(stall.vendorId);

    if (stall.stallId !== undefined && stall.stallId !== null) {
      return await getVendorIdByStallId(String(stall.stallId));
    }

    return null;
  } catch (e) {
    console.warn("Failed to read stalls doc:", e);
    return null;
  }
}

function getVendorId() {
  const qp = new URLSearchParams(window.location.search);

  // priority:
  // 1) vendorId directly
  // 2) selectedVendorId saved earlier
  // 3) vendorId key (legacy)
  return (
    qp.get("vendorId") ||
    localStorage.getItem("selectedVendorId") ||
    localStorage.getItem("vendorId") ||
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
  return data.imageUrl || data.imageURL || data.imgUrl || data.img || data.image || "";
}

function findName(data) {
  return data.foodName || data.itemName || data.name || "Untitled item";
}

function findPrice(data) {
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
  if (cartCountEl) cartCountEl.textContent = cartCount(cart);
  if (cartTotalEl) cartTotalEl.textContent = money(cartTotal(cart));

  if (!cartItemsEl) return;
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

  // single-vendor cart
  const existingVendor = cart[0]?.vendorId;
  if (existingVendor && existingVendor !== vendorId) {
    const ok = confirm("Your cart has items from another vendor. Clear cart and add this item?");
    if (!ok) return;
    writeCart([]);
  }

  const updated = readCart();
  const idx = updated.findIndex((x) => x.itemId === itemId);

  if (idx >= 0) updated[idx].qty += 1;
  else {
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
  if (cart[idx].qty <= 0) cart.splice(idx, 1);

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
  cartPanel?.classList.add("open");
  cartPanel?.setAttribute("aria-hidden", "false");
  renderCart();
});

cartCloseBtn?.addEventListener("click", () => {
  cartPanel?.classList.remove("open");
  cartPanel?.setAttribute("aria-hidden", "true");
});

cartPanel?.addEventListener("click", (e) => {
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
  window.location.href = "c-checkout.html";
});

// -----------------------
// ✅ Ensure vendor selected
// Accepts:
//  - ?vendorId=...
//  - ?stallId=2 (real vendor stallId)
//  - ?id=2 (alias)
//  - ?stallId=<STALLS_DOC_ID> (we convert using stalls doc)
// -----------------------
async function ensureVendorSelected() {
  const qp = new URLSearchParams(window.location.search);

  // ✅ 1) If URL has vendorId, ALWAYS use it (override localStorage)
  const vendorIdFromUrl = qp.get("vendorId");
  if (vendorIdFromUrl) {
    localStorage.setItem("selectedVendorId", vendorIdFromUrl);
    return vendorIdFromUrl;
  }

  // ✅ 2) If URL has stallId (or id), ALWAYS resolve it (override localStorage)
  const raw = qp.get("stallId") || qp.get("id");
  if (raw) {
    // First: treat raw as real vendor stallId ("1","2")
    let vendorId = await getVendorIdByStallId(raw);

    // If not found: treat raw as stalls doc id and convert
    if (!vendorId) vendorId = await getVendorIdFromStallsDoc(raw);

    if (!vendorId) return "";

    localStorage.setItem("selectedVendorId", vendorId);
    localStorage.setItem("selectedStallId", String(raw));
    return vendorId;
  }

  // ✅ 3) No URL params → fallback to localStorage
  return localStorage.getItem("selectedVendorId") || localStorage.getItem("vendorId") || "";
}


// -----------------------
// Load menu from Firestore
// -----------------------
async function loadMenu() {
  // ✅ IMPORTANT: resolve vendorId first (from stallId/id/stallsDocId)
  const vendorId = await ensureVendorSelected();

  if (!vendorId) {
    if (emptyMsg) {
      emptyMsg.style.display = "block";
      emptyMsg.textContent =
        "No vendor selected. Use ?stallId=2 or ?vendorId=... (or pass stalls doc id, if stalls has vendorId/stallId).";
    }
    return;
  }

  localStorage.setItem("selectedVendorId", vendorId);

  // 1) Vendor info
  try {
    const vendorSnap = await getDoc(doc(db, "vendor", vendorId));
    if (vendorSnap.exists()) {
      const v = vendorSnap.data();
      if (vendorNameEl) vendorNameEl.textContent = v.name || v.stallName || `Vendor: ${vendorId}`;
      if (vendorLocEl) vendorLocEl.textContent = v.stallLocation || v.location || "";
    } else {
      if (vendorNameEl) vendorNameEl.textContent = `Vendor: ${vendorId}`;
    }
  } catch (e) {
    console.warn("Vendor doc read failed:", e);
    if (vendorNameEl) vendorNameEl.textContent = `Vendor: ${vendorId}`;
  }

  // 2) Menu items
  if (grid) grid.innerHTML = "";
  if (emptyMsg) emptyMsg.style.display = "none";

  try {
    const menuRef = collection(db, "vendor", vendorId, MENU_SUBCOLLECTION);
    const menuSnap = await getDocs(menuRef);

    if (menuSnap.empty) {
      if (emptyMsg) {
        emptyMsg.style.display = "block";
        emptyMsg.textContent = "No menu items found.";
      }
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

      grid?.appendChild(card);
    });
  } catch (err) {
    console.error("Menu load error:", err);
    if (emptyMsg) {
      emptyMsg.style.display = "block";
      emptyMsg.textContent = "Failed to load menu. Check console + Firestore rules.";
    }
  }
}

// -----------------------
// Init
// -----------------------
(async function init() {
  renderCart();
  await loadMenu();
})();
