/* ─────────────────────────────────────────────────────────────────────────────
   Static JSON API – Clean & Friendly Client Logic
────────────────────────────────────────────────────────────────────────────── */

"use strict";

// ─── DOM References ───────────────────────────────────────────────────────────
const statusDot         = document.getElementById("statusDot");
const statusLabel       = document.getElementById("statusLabel");
const responseCode      = document.getElementById("responseCode");
const responseStatus    = document.getElementById("responseStatus");
const activeEndpointTag = document.getElementById("activeEndpointTag");
const btnCopy           = document.getElementById("btnCopy");
const productsTableBody = document.getElementById("productsTableBody");

const cardStatus    = document.getElementById("cardStatus");
const cardProducts  = document.getElementById("cardProducts");
const cardProductId = document.getElementById("cardProductId");

const btnStatus     = document.getElementById("btnStatus");
const btnProducts   = document.getElementById("btnProducts");
const btnProductId  = document.getElementById("btnProductId");
const productIdInput= document.getElementById("productIdInput");

let currentRawJson = "";

// ─── JSON Syntax Colorizer ────────────────────────────────────────────────────
function colorizeJson(json) {
  const safe = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return safe.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let cls = "json-number";
      if (/^"/.test(match)) {
        cls = /:$/.test(match) ? "json-key" : "json-string";
      } else if (/true|false/.test(match)) {
        cls = "json-bool";
      } else if (/null/.test(match)) {
        cls = "json-null";
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
}

// ─── Set Active Card Highlight ────────────────────────────────────────────────
function setActiveCard(activeCard) {
  [cardStatus, cardProducts, cardProductId].forEach((card) => {
    if (card) card.classList.remove("active");
  });
  if (activeCard) activeCard.classList.add("active");
}

// ─── API Fetch Handler ────────────────────────────────────────────────────────
async function callApi(endpoint, activeCard) {
  setActiveCard(activeCard);
  activeEndpointTag.textContent = `GET ${endpoint}`;
  responseStatus.textContent = "Loading…";
  responseStatus.className = "status-badge";
  responseCode.innerHTML = "<code>Fetching data from server…</code>";

  try {
    const res = await fetch(endpoint);
    const data = await res.json();
    currentRawJson = JSON.stringify(data, null, 2);

    responseCode.innerHTML = `<code>${colorizeJson(currentRawJson)}</code>`;

    if (res.ok) {
      responseStatus.textContent = `Status: ${res.status} OK`;
      responseStatus.className = "status-badge status-ok";
    } else {
      responseStatus.textContent = `Status: ${res.status} Error`;
      responseStatus.className = "status-badge status-error";
    }
  } catch (err) {
    const errorData = {
      status: "error",
      message: "Network request failed. Is the server running?",
      detail: err.message,
    };
    currentRawJson = JSON.stringify(errorData, null, 2);
    responseCode.innerHTML = `<code>${colorizeJson(currentRawJson)}</code>`;
    responseStatus.textContent = "Status: 500 Error";
    responseStatus.className = "status-badge status-error";
  }
}

// ─── Event Listeners ──────────────────────────────────────────────────────────
btnStatus.addEventListener("click", () => {
  callApi("/api/status", cardStatus);
});

btnProducts.addEventListener("click", () => {
  callApi("/api/products", cardProducts);
});

btnProductId.addEventListener("click", () => {
  const id = productIdInput.value.trim() || "1";
  callApi(`/api/products/${encodeURIComponent(id)}`, cardProductId);
});

productIdInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    btnProductId.click();
  }
});

// ─── Copy JSON ────────────────────────────────────────────────────────────────
btnCopy.addEventListener("click", async () => {
  if (!currentRawJson) return;

  try {
    await navigator.clipboard.writeText(currentRawJson);
    btnCopy.textContent = "✓ Copied!";
    btnCopy.classList.add("copied");
    setTimeout(() => {
      btnCopy.textContent = "Copy JSON";
      btnCopy.classList.remove("copied");
    }, 1800);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = currentRawJson;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);

    btnCopy.textContent = "✓ Copied!";
    setTimeout(() => {
      btnCopy.textContent = "Copy JSON";
    }, 1800);
  }
});

// ─── Populate Products Table ──────────────────────────────────────────────────
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function loadProductsTable() {
  try {
    const res = await fetch("/api/products");
    const json = await res.json();
    const products = json.data || [];

    if (products.length === 0) {
      productsTableBody.innerHTML = `<tr><td colspan="5" class="table-state-cell">No products found.</td></tr>`;
      return;
    }

    productsTableBody.innerHTML = products
      .map(
        (p) => `
        <tr>
          <td>#${p.id}</td>
          <td><strong>${escapeHtml(p.name)}</strong></td>
          <td><span class="category-tag">${escapeHtml(p.category)}</span></td>
          <td class="price-text">₹${Number(p.price).toLocaleString("en-IN")}</td>
          <td>${p.stock}</td>
        </tr>`
      )
      .join("");
  } catch {
    productsTableBody.innerHTML = `<tr><td colspan="5" class="table-state-cell" style="color:#ef4444;">Unable to load products from server.</td></tr>`;
  }
}

// ─── Check Server Status on Load ──────────────────────────────────────────────
async function checkServerStatus() {
  try {
    const res = await fetch("/api/status");
    if (res.ok) {
      statusDot.className = "status-dot online";
      statusLabel.textContent = "API Online";
    } else {
      statusDot.className = "status-dot offline";
      statusLabel.textContent = "API Offline";
    }
  } catch {
    statusDot.className = "status-dot offline";
    statusLabel.textContent = "Offline";
  }
}

// ─── Initial Load ─────────────────────────────────────────────────────────────
(async function init() {
  await checkServerStatus();
  await loadProductsTable();
  // Automatically show all products in the viewer on initial page load
  await callApi("/api/products", cardProducts);
})();
