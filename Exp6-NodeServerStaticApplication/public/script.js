/* ─────────────────────────────────────────────────────────────────────────────
   Static JSON API – Client Logic
────────────────────────────────────────────────────────────────────────────── */
"use strict";

// ── DOM refs ──────────────────────────────────────────────────────────────────
const statusDot         = document.getElementById("statusDot");
const statusLabel       = document.getElementById("statusLabel");
const responseCode      = document.getElementById("responseCode");
const responseStatus    = document.getElementById("responseStatus");
const activeEndpointTag = document.getElementById("activeEndpointTag");
const btnCopy           = document.getElementById("btnCopy");
const productsTableBody = document.getElementById("productsTableBody");

const cardStatus        = document.getElementById("cardStatus");
const cardProducts      = document.getElementById("cardProducts");
const cardProductId     = document.getElementById("cardProductId");

const btnStatus         = document.getElementById("btnStatus");
const btnProducts       = document.getElementById("btnProducts");
const btnProductId      = document.getElementById("btnProductId");
const productIdInput    = document.getElementById("productIdInput");

let currentRawJson = "";

// ── JSON Syntax Colorizer ─────────────────────────────────────────────────────
function colorizeJson(json) {
  const escaped = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped.replace(
    /("(?:\\u[0-9a-fA-F]{4}|\\[^u]|[^\\"])*"(?:\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
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

// ── Active card highlight ─────────────────────────────────────────────────────
function setActiveCard(card) {
  [cardStatus, cardProducts, cardProductId].forEach((c) => c?.classList.remove("active"));
  card?.classList.add("active");
}

// ── Status badge state ────────────────────────────────────────────────────────
function setStatusBadge(text, isError = false) {
  responseStatus.textContent = text;
  responseStatus.classList.toggle("error", isError);
}

// ── Fetch wrapper ─────────────────────────────────────────────────────────────
async function callApi(endpoint, activeCard) {
  setActiveCard(activeCard);
  activeEndpointTag.textContent = `GET ${endpoint}`;
  setStatusBadge("Loading…", false);
  responseCode.innerHTML = "<code>Fetching data…</code>";

  try {
    const res  = await fetch(endpoint);
    const data = await res.json();
    currentRawJson = JSON.stringify(data, null, 2);
    responseCode.innerHTML = `<code>${colorizeJson(currentRawJson)}</code>`;
    setStatusBadge(res.ok ? `${res.status} OK` : `${res.status} Error`, !res.ok);
  } catch (err) {
    const errObj = {
      status : "error",
      message: "Network request failed. Is the server running?",
      detail : err.message,
    };
    currentRawJson = JSON.stringify(errObj, null, 2);
    responseCode.innerHTML = `<code>${colorizeJson(currentRawJson)}</code>`;
    setStatusBadge("500 Error", true);
  }
}

// ── Button events ─────────────────────────────────────────────────────────────
btnStatus.addEventListener("click",   () => callApi("/api/status",   cardStatus));
btnProducts.addEventListener("click", () => callApi("/api/products", cardProducts));

btnProductId.addEventListener("click", () => {
  const id = (productIdInput.value || "").trim() || "1";
  callApi(`/api/products/${encodeURIComponent(id)}`, cardProductId);
});

productIdInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") btnProductId.click();
});

// ── Copy JSON ─────────────────────────────────────────────────────────────────
btnCopy.addEventListener("click", async () => {
  if (!currentRawJson) return;

  try {
    await navigator.clipboard.writeText(currentRawJson);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = currentRawJson;
    Object.assign(ta.style, { position: "fixed", opacity: "0", pointerEvents: "none" });
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  }

  btnCopy.textContent = "✓ Copied!";
  btnCopy.classList.add("copied");
  setTimeout(() => {
    btnCopy.textContent = "Copy JSON";
    btnCopy.classList.remove("copied");
  }, 1800);
});

// ── Products table ────────────────────────────────────────────────────────────
function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

async function loadProductsTable() {
  try {
    const res      = await fetch("/api/products");
    const json     = await res.json();
    const products = json.data || [];

    if (!products.length) {
      productsTableBody.innerHTML =
        `<tr><td colspan="5" class="table-empty">No products found.</td></tr>`;
      return;
    }

    productsTableBody.innerHTML = products.map((p) => `
      <tr>
        <td>#${escHtml(String(p.id))}</td>
        <td><strong>${escHtml(p.name)}</strong></td>
        <td><span class="tag-cat">${escHtml(p.category)}</span></td>
        <td class="td-price">₹${Number(p.price).toLocaleString("en-IN")}</td>
        <td>${escHtml(String(p.stock))}</td>
      </tr>`).join("");

  } catch {
    productsTableBody.innerHTML =
      `<tr><td colspan="5" class="table-empty" style="color:#EF4444">
         Unable to load products. Is the server running?
       </td></tr>`;
  }
}

// ── Server status ─────────────────────────────────────────────────────────────
async function checkServerStatus() {
  try {
    const res = await fetch("/api/status");
    if (res.ok) {
      statusDot.className = "pill-dot online";
      statusLabel.textContent = "API Online";
    } else {
      throw new Error("not ok");
    }
  } catch {
    statusDot.className = "pill-dot offline";
    statusLabel.textContent = "Offline";
  }
}

// ── Init ──────────────────────────────────────────────────────────────────────
(async function init() {
  await checkServerStatus();
  await loadProductsTable();
  await callApi("/api/products", cardProducts);
}());
