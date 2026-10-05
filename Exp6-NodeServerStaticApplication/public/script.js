/* ═══════════════════════════════════════════════════════════════
   Static JSON API  ·  Client Script
   ═══════════════════════════════════════════════════════════════ */
"use strict";

// ── DOM refs ──────────────────────────────────────────────────────
const statusDot         = document.getElementById("statusDot");
const statusLabel       = document.getElementById("statusLabel");
const responseCode      = document.getElementById("responseCode");
const responseStatus    = document.getElementById("responseStatus");
const respGutter        = document.getElementById("respGutter");
const btnCopy           = document.getElementById("btnCopy");
const productsTableBody = document.getElementById("productsTableBody");

const cardStatus    = document.getElementById("cardStatus");
const cardProducts  = document.getElementById("cardProducts");
const cardProductId = document.getElementById("cardProductId");

const btnStatus     = document.getElementById("btnStatus");
const btnProducts   = document.getElementById("btnProducts");
const btnProductId  = document.getElementById("btnProductId");
const productIdInput = document.getElementById("productIdInput");

let currentRawJson = "";

// ── Scroll Reveal ─────────────────────────────────────────────────
function initScrollReveal() {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          // once visible, stop watching
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );

  document.querySelectorAll(".reveal, .reveal-item").forEach((el) => io.observe(el));
}

// ── JSON Syntax Colorizer ─────────────────────────────────────────
function colorizeJson(json) {
  const esc = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return esc.replace(
    /("(?:\\u[0-9a-fA-F]{4}|\\[^u]|[^\\"])*"(?:\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (m) => {
      let cls = "json-number";
      if (/^"/.test(m))      cls = /:$/.test(m) ? "json-key" : "json-string";
      else if (/true|false/.test(m)) cls = "json-bool";
      else if (/null/.test(m))       cls = "json-null";
      return `<span class="${cls}">${m}</span>`;
    }
  );
}

// ── Update gutter line numbers ────────────────────────────────────
function updateGutter(text) {
  const lines = text.split("\n").length;
  respGutter.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join("\n");
}

// ── Active card ───────────────────────────────────────────────────
function setActiveCard(card) {
  [cardStatus, cardProducts, cardProductId].forEach((c) => c?.classList.remove("active"));
  card?.classList.add("active");
}

// ── Status badge ──────────────────────────────────────────────────
function setStatus(text, isError = false) {
  responseStatus.textContent = text;
  responseStatus.classList.toggle("error", isError);
}

// ── API call ──────────────────────────────────────────────────────
async function callApi(endpoint, activeCard) {
  setActiveCard(activeCard);
  setStatus("Status: Loading…", false);
  const placeholder = "Fetching data…";
  responseCode.innerHTML = `<code>${placeholder}</code>`;
  updateGutter(placeholder);

  try {
    const res  = await fetch(endpoint);
    const data = await res.json();
    currentRawJson = JSON.stringify(data, null, 2);
    responseCode.innerHTML = `<code>${colorizeJson(currentRawJson)}</code>`;
    updateGutter(currentRawJson);
    setStatus(res.ok ? `Status: ${res.status} OK` : `Status: ${res.status} Error`, !res.ok);
  } catch (err) {
    const errObj = { status: "error", message: "Network request failed. Is the server running?", detail: err.message };
    currentRawJson = JSON.stringify(errObj, null, 2);
    responseCode.innerHTML = `<code>${colorizeJson(currentRawJson)}</code>`;
    updateGutter(currentRawJson);
    setStatus("Status: 500 Error", true);
  }
}

// ── Button wiring ─────────────────────────────────────────────────
btnStatus.addEventListener("click",   () => callApi("/api/status",   cardStatus));
btnProducts.addEventListener("click", () => callApi("/api/products", cardProducts));

btnProductId.addEventListener("click", () => {
  const id = (productIdInput.value || "").trim() || "1";
  callApi(`/api/products/${encodeURIComponent(id)}`, cardProductId);
});

productIdInput.addEventListener("keydown", (e) => { if (e.key === "Enter") btnProductId.click(); });

// ── Copy JSON ─────────────────────────────────────────────────────
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
  setTimeout(() => { btnCopy.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy JSON`; btnCopy.classList.remove("copied"); }, 1800);
});

// ── Category icons map ────────────────────────────────────────────
const ICONS = {
  "Electronics": "🎧",
  "Wearables":   "⌚",
  "Peripherals": "⌨️",
  "Accessories": "🖥️",
  "Storage":     "💾",
  "Audio":       "🔊",
  "default":     "📦",
};

function getIcon(category) {
  return ICONS[category] || ICONS["default"];
}

// ── HTML escape ───────────────────────────────────────────────────
function esc(str) {
  return String(str)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// ── Products table ────────────────────────────────────────────────
async function loadProductsTable() {
  try {
    const res      = await fetch("/api/products");
    const json     = await res.json();
    const products = json.data || [];

    if (!products.length) {
      productsTableBody.innerHTML = `<tr><td colspan="5" class="tbl-empty">No products found.</td></tr>`;
      return;
    }

    productsTableBody.innerHTML = products.map((p, i) => `
      <tr>
        <td><div class="td-icon">${getIcon(p.category)}</div></td>
        <td><strong>${esc(p.name)}</strong></td>
        <td class="td-cat">${esc(p.category)}</td>
        <td class="td-price">${Number(p.price).toLocaleString("en-IN")}</td>
        <td class="td-stock">${esc(String(p.stock))}</td>
      </tr>`).join("");
  } catch {
    productsTableBody.innerHTML = `<tr><td colspan="5" class="tbl-empty" style="color:#ef4444">Unable to load products. Is the server running?</td></tr>`;
  }
}

// ── Server status ─────────────────────────────────────────────────
async function checkServerStatus() {
  try {
    const res = await fetch("/api/status");
    if (res.ok) {
      statusDot.className = "hdr-dot online";
      statusLabel.textContent = "API Online";
    } else { throw new Error(); }
  } catch {
    statusDot.className = "hdr-dot offline";
    statusLabel.textContent = "Offline";
  }
}

// ── Init ──────────────────────────────────────────────────────────
(async function init() {
  initScrollReveal();
  await checkServerStatus();
  await loadProductsTable();
  await callApi("/api/products", cardProducts);
}());
