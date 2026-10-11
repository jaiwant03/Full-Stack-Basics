"use strict";

const statusDot = document.getElementById("statusDot");
const statusLabel = document.getElementById("statusLabel");
const responseCode = document.getElementById("responseCode");
const responseStatus = document.getElementById("responseStatus");
const respGutter = document.getElementById("respGutter");
const btnCopy = document.getElementById("btnCopy");
const studentsTableBody = document.getElementById("studentsTableBody");

const cardStatus = document.getElementById("cardStatus");
const cardStudents = document.getElementById("cardStudents");
const cardStudentId = document.getElementById("cardStudentId");
const btnStatus = document.getElementById("btnStatus");
const btnStudents = document.getElementById("btnStudents");
const btnStudentId = document.getElementById("btnStudentId");
const studentIdInput = document.getElementById("studentIdInput");

let currentRawJson = "";

function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );

  document.querySelectorAll(".reveal, .reveal-item").forEach((element) => observer.observe(element));
}

function colorizeJson(json) {
  const escaped = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped.replace(
    /("(?:\\u[0-9a-fA-F]{4}|\\[^u]|[^\\"])*"(?:\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let className = "json-number";
      if (/^"/.test(match)) className = /:$/.test(match) ? "json-key" : "json-string";
      else if (/true|false/.test(match)) className = "json-bool";
      else if (/null/.test(match)) className = "json-null";
      return `<span class="${className}">${match}</span>`;
    }
  );
}

function updateGutter(text) {
  respGutter.innerHTML = Array.from(
    { length: text.split("\n").length },
    (_, index) => index + 1
  ).join("\n");
}

function setActiveCard(card) {
  [cardStatus, cardStudents, cardStudentId].forEach((element) => element.classList.remove("active"));
  card.classList.add("active");
}

function setStatus(text, isError = false) {
  responseStatus.textContent = text;
  responseStatus.classList.toggle("error", isError);
}

function displayResponse(data) {
  currentRawJson = JSON.stringify(data, null, 2);
  responseCode.innerHTML = `<code>${colorizeJson(currentRawJson)}</code>`;
  updateGutter(currentRawJson);
}

async function callApi(endpoint, activeCard) {
  setActiveCard(activeCard);
  setStatus("Status: Loading…");
  responseCode.innerHTML = "<code>Fetching data…</code>";
  updateGutter("Fetching data…");

  try {
    const response = await fetch(endpoint);
    const data = await response.json();
    displayResponse(data);
    setStatus(
      response.ok ? `Status: ${response.status} OK` : `Status: ${response.status} Error`,
      !response.ok
    );
  } catch (error) {
    displayResponse({
      message: "Unable to reach the server. Make sure the Node.js server is running.",
      detail: error.message,
    });
    setStatus("Status: Network Error", true);
  }
}

btnStatus.addEventListener("click", () => callApi("/api/status", cardStatus));
btnStudents.addEventListener("click", () => callApi("/api/students", cardStudents));
btnStudentId.addEventListener("click", () => {
  const id = studentIdInput.value.trim();
  if (!id) {
    studentIdInput.focus();
    setStatus("Enter a student ID", true);
    return;
  }

  callApi(`/api/students/${encodeURIComponent(id)}`, cardStudentId);
});

studentIdInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") btnStudentId.click();
});

btnCopy.addEventListener("click", async () => {
  if (!currentRawJson) return;

  try {
    await navigator.clipboard.writeText(currentRawJson);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = currentRawJson;
    Object.assign(textarea.style, { position: "fixed", opacity: "0", pointerEvents: "none" });
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }

  btnCopy.textContent = "✓ Copied!";
  btnCopy.classList.add("copied");
  setTimeout(() => {
    btnCopy.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy JSON`;
    btnCopy.classList.remove("copied");
  }, 1800);
});

const DEPARTMENT_ICONS = {
  "Computer Science": "💻",
  "Information Technology": "🌐",
  "AI & DS": "🤖",
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function loadStudentsTable() {
  studentsTableBody.innerHTML = '<tr><td colspan="5" class="tbl-empty">Loading students…</td></tr>';

  try {
    const response = await fetch("/api/students");
    if (!response.ok) throw new Error(`Server returned ${response.status}`);
    const students = await response.json();

    if (!Array.isArray(students) || students.length === 0) {
      studentsTableBody.innerHTML = '<tr><td colspan="5" class="tbl-empty">No students found.</td></tr>';
      return;
    }

    studentsTableBody.innerHTML = students.map((student) => `
      <tr>
        <td><div class="td-icon">${escapeHtml(String(student.id))}</div></td>
        <td><strong>${escapeHtml(student.name)}</strong><br><small>${escapeHtml(student.rollNo)}</small></td>
        <td><span class="department-badge">${DEPARTMENT_ICONS[student.department] || "🎓"} ${escapeHtml(student.department)}</span></td>
        <td class="td-stock">Year ${escapeHtml(String(student.year))} / Sem ${escapeHtml(String(student.semester))}</td>
        <td class="td-price">${escapeHtml(Number(student.gpa).toFixed(1))}</td>
      </tr>`).join("");
  } catch (error) {
    studentsTableBody.innerHTML = `<tr><td colspan="5" class="tbl-empty" style="color:#ef4444">Unable to load students: ${escapeHtml(error.message)}</td></tr>`;
  }
}

async function checkServerStatus() {
  try {
    const response = await fetch("/api/status");
    if (!response.ok) throw new Error(`Server returned ${response.status}`);
    statusDot.className = "hdr-dot online";
    statusLabel.textContent = "API Online";
  } catch {
    statusDot.className = "hdr-dot offline";
    statusLabel.textContent = "Offline";
  }
}

(async function init() {
  initScrollReveal();
  await Promise.all([checkServerStatus(), loadStudentsTable()]);
  await callApi("/api/students", cardStudents);
}());
