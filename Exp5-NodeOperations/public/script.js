/**
 * Node.js Web Server & File Operations — Client Script
 */

document.addEventListener("DOMContentLoaded", () => {

  // ── DOM References ─────────────────────────────────────────────
  const serverStatusBadge   = document.getElementById("serverStatusBadge");
  const serverStatusText    = document.getElementById("serverStatusText");

  const createFileForm      = document.getElementById("createFileForm");
  const createFileName      = document.getElementById("createFileName");
  const createFileContent   = document.getElementById("createFileContent");
  const btnCreateFile       = document.getElementById("btnCreateFile");

  const filesTableBody      = document.getElementById("filesTableBody");
  const noFilesMessage      = document.getElementById("noFilesMessage");

  const checkFileForm       = document.getElementById("checkFileForm");
  const checkFileNameInput  = document.getElementById("checkFileNameInput");
  const checkResult         = document.getElementById("checkResult");

  const viewModal           = document.getElementById("viewModal");
  const viewModalFilename   = document.getElementById("viewModalFilename");
  const viewModalContent    = document.getElementById("viewModalContent");
  const appendContentInput  = document.getElementById("appendContentInput");
  const btnAppendContent    = document.getElementById("btnAppendContent");

  const deleteModal         = document.getElementById("deleteModal");
  const deleteTargetName    = document.getElementById("deleteTargetName");
  const btnConfirmDelete    = document.getElementById("btnConfirmDelete");

  const toastContainer      = document.getElementById("toastContainer");

  let activeFilename = null;

  // ── Toast ──────────────────────────────────────────────────────
  function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span class="toast-bar"></span>${escapeHtml(message)}`;
    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => toast.classList.add("show"));
    });

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => { if (toast.parentElement) toast.remove(); }, 260);
    }, 3400);
  }

  // ── Modal Helpers ──────────────────────────────────────────────
  function openModal(modal) {
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal(modal) {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
  }

  // Close buttons
  document.querySelectorAll(".modal-close-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-close");
      const modal = document.getElementById(id);
      if (modal) closeModal(modal);
    });
  });

  // Click backdrop to close
  document.querySelectorAll(".modal-overlay").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  // Escape key
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const open = document.querySelector(".modal-overlay.active");
      if (open) closeModal(open);
    }
  });

  // ── 1. Server Status ───────────────────────────────────────────
  async function fetchServerStatus() {
    try {
      const res = await fetch("/api/status");
      const data = await res.json();
      if (data.success) {
        serverStatusBadge.className = "status-pill";
        serverStatusText.textContent = "Server Online";
      } else throw new Error();
    } catch {
      serverStatusBadge.className = "status-pill offline";
      serverStatusText.textContent = "Server Offline";
    }
  }

  // ── 2. File List ───────────────────────────────────────────────
  async function fetchFiles() {
    try {
      const res = await fetch("/api/files");
      const data = await res.json();

      if (!data.success || !data.files || data.files.length === 0) {
        filesTableBody.innerHTML = "";
        noFilesMessage.classList.remove("hidden");
        return;
      }

      noFilesMessage.classList.add("hidden");
      filesTableBody.innerHTML = data.files.map((file) => {
        const dateStr = file.lastModified
          ? new Date(file.lastModified).toLocaleDateString("en-US", {
              month: "short", day: "numeric", year: "numeric"
            })
          : "—";

        return `
          <tr>
            <td class="col-name">${escapeHtml(file.filename)}</td>
            <td class="col-meta">${escapeHtml(file.formattedSize || "0 B")}</td>
            <td class="col-meta">${escapeHtml(dateStr)}</td>
            <td class="col-actions">
              <button type="button" class="tbl-btn tbl-view" data-action="view" data-name="${escapeHtml(file.filename)}">View</button>
              <button type="button" class="tbl-btn tbl-delete" data-action="delete" data-name="${escapeHtml(file.filename)}">Delete</button>
            </td>
          </tr>
        `;
      }).join("");
    } catch (err) {
      filesTableBody.innerHTML = `<tr class="table-empty-row"><td colspan="4">Failed to load files from server.</td></tr>`;
      console.error(err);
    }
  }

  // Table delegation
  filesTableBody.addEventListener("click", (e) => {
    const btn = e.target.closest(".tbl-btn");
    if (!btn) return;
    const action = btn.getAttribute("data-action");
    const filename = btn.getAttribute("data-name");
    if (action === "view") openViewModal(filename);
    else if (action === "delete") openDeleteModal(filename);
  });

  // ── 3. Create File ─────────────────────────────────────────────
  createFileForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const filename = createFileName.value.trim();
    const content = createFileContent.value;

    if (!filename) {
      showToast("Please enter a filename.", "error");
      createFileName.focus();
      return;
    }
    if (!content.trim()) {
      showToast("Please enter file content.", "error");
      createFileContent.focus();
      return;
    }

    btnCreateFile.disabled = true;
    try {
      const res = await fetch("/api/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename, content })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to create file");

      showToast(`"${filename}" created successfully`, "success");
      createFileName.value = "";
      createFileContent.value = "";
      fetchFiles();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      btnCreateFile.disabled = false;
    }
  });

  // ── 4. View File & Append ──────────────────────────────────────
  async function openViewModal(filename) {
    activeFilename = filename;
    viewModalFilename.textContent = filename;
    viewModalContent.textContent = "Loading…";
    appendContentInput.value = "";
    openModal(viewModal);

    try {
      const res = await fetch(`/api/files/${encodeURIComponent(filename)}`);
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Unable to read file");
      viewModalContent.textContent = data.content || "(Empty file)";
    } catch (err) {
      viewModalContent.textContent = `Error: ${err.message}`;
      showToast(err.message, "error");
    }
  }

  btnAppendContent.addEventListener("click", async () => {
    const content = appendContentInput.value;
    if (!content.trim()) {
      showToast("Please enter content to append.", "error");
      appendContentInput.focus();
      return;
    }

    btnAppendContent.disabled = true;
    try {
      const res = await fetch(`/api/files/${encodeURIComponent(activeFilename)}/append`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Unable to append content");

      showToast("Content appended successfully", "success");
      appendContentInput.value = "";
      await openViewModal(activeFilename);
      fetchFiles();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      btnAppendContent.disabled = false;
    }
  });

  // ── 5. Delete File ─────────────────────────────────────────────
  function openDeleteModal(filename) {
    activeFilename = filename;
    deleteTargetName.textContent = filename;
    openModal(deleteModal);
  }

  btnConfirmDelete.addEventListener("click", async () => {
    if (!activeFilename) return;
    btnConfirmDelete.disabled = true;
    try {
      const res = await fetch(`/api/files/${encodeURIComponent(activeFilename)}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to delete file");

      showToast(`"${activeFilename}" deleted`, "success");
      closeModal(deleteModal);
      fetchFiles();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      btnConfirmDelete.disabled = false;
    }
  });

  // ── 6. Check File Existence ────────────────────────────────────
  checkFileForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const filename = checkFileNameInput.value.trim();
    if (!filename) {
      showToast("Please enter a filename to check.", "error");
      return;
    }

    checkResult.className = "check-result";
    checkResult.textContent = "Checking…";

    try {
      const res = await fetch(`/api/files/${encodeURIComponent(filename)}/exists`);
      const data = await res.json();

      if (data.exists) {
        checkResult.className = "check-result exists";
        checkResult.textContent = `✓  "${filename}" exists on the server`;
      } else {
        checkResult.className = "check-result not-exists";
        checkResult.textContent = `✕  "${filename}" does not exist`;
      }
    } catch {
      checkResult.className = "check-result not-exists";
      checkResult.textContent = "✕  Check failed — server error";
      showToast("Failed to check file existence", "error");
    }
  });

  // ── Utility ────────────────────────────────────────────────────
  function escapeHtml(text) {
    if (!text) return "";
    return String(text)
      .replace(/&/g,  "&amp;")
      .replace(/</g,  "&lt;")
      .replace(/>/g,  "&gt;")
      .replace(/"/g,  "&quot;")
      .replace(/'/g,  "&#039;");
  }

  // ── Init ───────────────────────────────────────────────────────
  fetchServerStatus();
  fetchFiles();
});
