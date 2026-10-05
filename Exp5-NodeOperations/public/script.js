/**
 * ============================================================================
 * NodeFile Server — Minimal Client-Side Application
 * ============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // State
  let activeFilename = null;

  // DOM Elements
  const serverStatusBadge = document.getElementById("serverStatusBadge");
  const serverStatusText = document.getElementById("serverStatusText");

  const createFileForm = document.getElementById("createFileForm");
  const createFileName = document.getElementById("createFileName");
  const createFileContent = document.getElementById("createFileContent");
  const btnCreateFile = document.getElementById("btnCreateFile");

  const filesTableBody = document.getElementById("filesTableBody");
  const noFilesMessage = document.getElementById("noFilesMessage");

  const checkFileForm = document.getElementById("checkFileForm");
  const checkFileNameInput = document.getElementById("checkFileNameInput");
  const checkResult = document.getElementById("checkResult");

  // Modals
  const viewModal = document.getElementById("viewModal");
  const viewModalFilename = document.getElementById("viewModalFilename");
  const viewModalContent = document.getElementById("viewModalContent");
  const appendContentInput = document.getElementById("appendContentInput");
  const btnAppendContent = document.getElementById("btnAppendContent");

  const renameModal = document.getElementById("renameModal");
  const renameFileForm = document.getElementById("renameFileForm");
  const renameCurrentName = document.getElementById("renameCurrentName");
  const renameNewNameInput = document.getElementById("renameNewNameInput");
  const btnSubmitRename = document.getElementById("btnSubmitRename");

  const deleteModal = document.getElementById("deleteModal");
  const deleteTargetName = document.getElementById("deleteTargetName");
  const btnConfirmDelete = document.getElementById("btnConfirmDelete");

  const toastContainer = document.getElementById("toastContainer");

  // ==========================================================================
  // Toast Notifications
  // ==========================================================================
  function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.add("show");
    });

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        if (toast.parentElement) toast.remove();
      }, 250);
    }, 3200);
  }

  // ==========================================================================
  // Modal Helpers
  // ==========================================================================
  function openModal(modal) {
    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal(modal) {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
  }

  document.querySelectorAll(".modal-close-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const modalId = btn.getAttribute("data-close");
      const modal = document.getElementById(modalId);
      if (modal) closeModal(modal);
    });
  });

  document.querySelectorAll(".modal-backdrop").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const open = document.querySelector(".modal-backdrop.active");
      if (open) closeModal(open);
    }
  });

  // ==========================================================================
  // API Calls
  // ==========================================================================

  // 1. Server Status
  async function fetchServerStatus() {
    try {
      const res = await fetch("/api/status");
      const data = await res.json();
      if (data.success) {
        serverStatusBadge.className = "status-badge";
        serverStatusText.textContent = "Server Online";
      } else {
        throw new Error();
      }
    } catch {
      serverStatusBadge.className = "status-badge offline";
      serverStatusText.textContent = "Server Offline";
    }
  }

  // 2. Fetch Files
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
          ? new Date(file.lastModified).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
          : "-";

        return `
          <tr>
            <td class="file-name-col">${escapeHtml(file.filename)}</td>
            <td class="file-meta-col">${escapeHtml(file.formattedSize || "0 B")}</td>
            <td class="file-meta-col">${escapeHtml(dateStr)}</td>
            <td class="text-right">
              <div class="table-actions">
                <button type="button" class="btn-table btn-view" data-action="view" data-name="${escapeHtml(file.filename)}">View</button>
                <button type="button" class="btn-table btn-rename" data-action="rename" data-name="${escapeHtml(file.filename)}">Rename</button>
                <button type="button" class="btn-table btn-delete" data-action="delete" data-name="${escapeHtml(file.filename)}">Delete</button>
              </div>
            </td>
          </tr>
        `;
      }).join("");
    } catch (err) {
      filesTableBody.innerHTML = `<tr><td colspan="4" class="table-message-cell">Failed to load files from server.</td></tr>`;
      console.error(err);
    }
  }

  // 3. Create File
  createFileForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const filename = createFileName.value.trim();
    const content = createFileContent.value;

    if (!filename) {
      showToast("Please enter a filename.", "error");
      createFileName.focus();
      return;
    }

    if (!content) {
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
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create file");
      }

      showToast("File created successfully", "success");
      createFileName.value = "";
      createFileContent.value = "";
      fetchFiles();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      btnCreateFile.disabled = false;
    }
  });

  // Table Actions Delegation
  filesTableBody.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-table");
    if (!btn) return;

    const action = btn.getAttribute("data-action");
    const filename = btn.getAttribute("data-name");

    if (action === "view") {
      openViewModal(filename);
    } else if (action === "rename") {
      openRenameModal(filename);
    } else if (action === "delete") {
      openDeleteModal(filename);
    }
  });

  // 4. View File & Append
  async function openViewModal(filename) {
    activeFilename = filename;
    viewModalFilename.textContent = filename;
    viewModalContent.textContent = "Loading file content...";
    appendContentInput.value = "";
    openModal(viewModal);

    try {
      const res = await fetch(`/api/files/${encodeURIComponent(filename)}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Unable to read file");
      }

      viewModalContent.textContent = data.content || "(Empty file)";
    } catch (err) {
      viewModalContent.textContent = `Error: ${err.message}`;
      showToast(err.message, "error");
    }
  }

  btnAppendContent.addEventListener("click", async () => {
    const content = appendContentInput.value;
    if (!content || !content.trim()) {
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
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Unable to append content");
      }

      showToast("✓ Content appended successfully", "success");
      appendContentInput.value = "";
      // Refresh preview and file list
      await openViewModal(activeFilename);
      fetchFiles();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      btnAppendContent.disabled = false;
    }
  });

  // 5. Rename File
  function openRenameModal(filename) {
    activeFilename = filename;
    renameCurrentName.textContent = filename;
    renameNewNameInput.value = filename;
    openModal(renameModal);
    setTimeout(() => {
      renameNewNameInput.focus();
      renameNewNameInput.select();
    }, 100);
  }

  renameFileForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newFilename = renameNewNameInput.value.trim();

    if (!newFilename) {
      showToast("Please enter a new filename.", "error");
      return;
    }

    btnSubmitRename.disabled = true;

    try {
      const res = await fetch(`/api/files/${encodeURIComponent(activeFilename)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newFilename })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to rename file");
      }

      showToast("File renamed successfully", "success");
      closeModal(renameModal);
      fetchFiles();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      btnSubmitRename.disabled = false;
    }
  });

  // 6. Delete File
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
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete file");
      }

      showToast("File deleted successfully", "success");
      closeModal(deleteModal);
      fetchFiles();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      btnConfirmDelete.disabled = false;
    }
  });

  // 7. Check File Existence
  checkFileForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const filename = checkFileNameInput.value.trim();

    if (!filename) {
      showToast("Please enter a filename to check.", "error");
      return;
    }

    checkResult.className = "check-result-text";
    checkResult.textContent = "Checking...";

    try {
      const res = await fetch(`/api/files/${encodeURIComponent(filename)}/exists`);
      const data = await res.json();

      if (data.exists) {
        checkResult.className = "check-result-text exists";
        checkResult.textContent = "✓ File exists";
      } else {
        checkResult.className = "check-result-text not-exists";
        checkResult.textContent = "✕ File does not exist";
      }
    } catch (err) {
      checkResult.className = "check-result-text not-exists";
      checkResult.textContent = "✕ Check failed";
      showToast("Failed to check file existence", "error");
    }
  });

  // Utility: Escape HTML
  function escapeHtml(text) {
    if (!text) return "";
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Initialization
  fetchServerStatus();
  fetchFiles();
});
