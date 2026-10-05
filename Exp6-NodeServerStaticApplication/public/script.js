/* ─────────────────────────────────────────────────────────────────────────────
   Static JSON API – script.js
   Handles: API status check, product table, endpoint testing, JSON viewer
────────────────────────────────────────────────────────────────────────────── */

"use strict";

// ─── DOM References ────────────────────────────────────────────────────────────
const statusDot        = document.getElementById("statusDot");
const statusLabel      = document.getElementById("statusLabel");
const responseViewer   = document.getElementById("responseViewer");
const responsePlaceholder = document.getElementById("responsePlaceholder");
const responseCode     = document.getElementById("responseCode");
const responseStatus   = document.getElementById("responseStatus");
const btnCopy          = document.getElementById("btnCopy");
const productsTableBody = document.getElementById("productsTableBody");

// Endpoint buttons
const btnStatus    = document.getElementById("btnStatus");
const btnProducts  = document.getElementById("btnProducts");
const btnProductId = document.getElementById("btnProductId");
const productIdInput = document.getElementById("productIdInput");

// ─── Utility: JSON Syntax Highlighter ─────────────────────────────────────────
function syntaxHighlight(json) {
  const escaped = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped.replace(
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

// ─── Utility: Display Response in Viewer ──────────────────────────────────────
function showResponse(data, httpStatus) {
  const jsonStr = JSON.stringify(data, null, 2);

  // Hide placeholder, show code block
  responsePlaceholder.classList.add("hidden");
  responseCode.classList.remove("hidden");

  // Syntax-highlighted output
  responseCode.innerHTML = syntaxHighlight(jsonStr);

  // Status badge
  const isOk = httpStatus >= 200 && httpStatus < 300;
  responseStatus.textContent = `${httpStatus} ${isOk ? "OK" : "Error"}`;
  responseStatus.className = `response-status ${isOk ? "status-ok" : "status-error"}`;

  // Enable copy button
  btnCopy.disabled = false;
  // Store raw JSON for copying
  btnCopy.dataset.json = jsonStr;
}

// ─── Utility: Show Loading State in Viewer ────────────────────────────────────
function showViewerLoading() {
  responsePlaceholder.classList.remove("hidden");
  responsePlaceholder.innerHTML = `
    <span class="loading-spinner" aria-hidden="true"></span>
    <p style="color:#9ca3af;margin-top:10px;">Fetching response…</p>
  `;
  responseCode.classList.add("hidden");
  responseStatus.textContent = "—";
  responseStatus.className = "response-status";
  btnCopy.disabled = true;
}

// ─── Utility: Show Error in Viewer ────────────────────────────────────────────
function showViewerError(message) {
  responsePlaceholder.classList.remove("hidden");
  responsePlaceholder.innerHTML = `
    <span class="placeholder-icon" aria-hidden="true">⚠</span>
    <p style="color:#ef4444;">${message}</p>
  `;
  responseCode.classList.add("hidden");
  responseStatus.textContent = "Error";
  responseStatus.className = "response-status status-error";
  btnCopy.disabled = true;
}

// ─── Core Fetch Helper ────────────────────────────────────────────────────────
async function callAPI(endpoint) {
  showViewerLoading();
  // Scroll to response section smoothly
  document.querySelector(".response-section").scrollIntoView({ behavior: "smooth", block: "start" });

  try {
    const res = await fetch(endpoint);
    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error("Server returned non-JSON response.");
    }
    showResponse(data, res.status);
  } catch (err) {
    showViewerError(`Request failed: ${err.message}`);
  }
}

// ─── Button: Try /api/status ──────────────────────────────────────────────────
btnStatus.addEventListener("click", () => {
  callAPI("/api/status");
});

// ─── Button: Try /api/products ────────────────────────────────────────────────
btnProducts.addEventListener("click", () => {
  callAPI("/api/products");
});

// ─── Button: Try /api/products/:id ───────────────────────────────────────────
btnProductId.addEventListener("click", () => {
  const id = productIdInput.value.trim();
  if (!id) {
    productIdInput.focus();
    productIdInput.style.borderColor = "#ef4444";
    productIdInput.style.boxShadow = "0 0 0 3px rgba(239,68,68,0.12)";
    setTimeout(() => {
      productIdInput.style.borderColor = "";
      productIdInput.style.boxShadow = "";
    }, 1800);
    return;
  }
  callAPI(`/api/products/${encodeURIComponent(id)}`);
});

// Allow pressing Enter inside the ID input
productIdInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") btnProductId.click();
});

// ─── Button: Copy JSON ────────────────────────────────────────────────────────
btnCopy.addEventListener("click", async () => {
  const json = btnCopy.dataset.json;
  if (!json) return;

  try {
    await navigator.clipboard.writeText(json);
    const original = btnCopy.textContent;
    btnCopy.textContent = "✓ Copied!";
    btnCopy.classList.add("copied");
    setTimeout(() => {
      btnCopy.textContent = original;
      btnCopy.classList.remove("copied");
    }, 2000);
  } catch {
    // Fallback for older browsers
    const ta = document.createElement("textarea");
    ta.value = json;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    btnCopy.textContent = "✓ Copied!";
    setTimeout(() => (btnCopy.textContent = "Copy JSON"), 2000);
  }
});

// ─── API Status Check (on page load) ─────────────────────────────────────────
async function checkAPIStatus() {
  try {
    const res = await fetch("/api/status");
    if (res.ok) {
      statusDot.classList.add("online");
      statusLabel.textContent = "API Online";
    } else {
      statusDot.classList.add("offline");
      statusLabel.textContent = "API Error";
    }
  } catch {
    statusDot.classList.add("offline");
    statusLabel.textContent = "Offline";
  }
}

// ─── Load Products into Table ─────────────────────────────────────────────────
function formatPrice(price) {
  return `₹${price.toLocaleString("en-IN")}`;
}

function getStockPercent(stock) {
  // Assume max stock is 80 for display purposes
  return Math.min(Math.round((stock / 80) * 100), 100);
}

function buildTableRows(products) {
  if (!products || products.length === 0) {
    return `<tr><td colspan="5" class="table-loading">No products found.</td></tr>`;
  }

  return products
    .map(
      (p) => `
    <tr>
      <td>#${p.id}</td>
      <td>${escapeHtml(p.name)}</td>
      <td><span class="category-pill">${escapeHtml(p.category)}</span></td>
      <td class="price-cell">${formatPrice(p.price)}</td>
      <td>
        <div class="stock-cell">
          <span>${p.stock}</span>
          <div class="stock-bar-wrap">
            <div class="stock-bar" style="width:${getStockPercent(p.stock)}%"></div>
          </div>
        </div>
      </td>
    </tr>`
    )
    .join("");
}

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
    productsTableBody.innerHTML = buildTableRows(products);
  } catch {
    productsTableBody.innerHTML = `<tr><td colspan="5" class="table-error">⚠ Failed to load products. Make sure the server is running.</td></tr>`;
  }
}

// ─── Init ─────────────────────────────────────────────────────────────────────
(async function init() {
  await checkAPIStatus();
  await loadProductsTable();
})();
