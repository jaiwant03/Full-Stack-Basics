/**
 * ============================================================================
 * NodeFile Server — Frontend JavaScript Application
 * ============================================================================
 * Handles UI interactions, API calls to Express server, DOM updates,
 * modals, toast notifications, and client-side activity logging.
 * ============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================================================
  // 1. Application State & DOM References
  // ==========================================================================
  const state = {
    files: [],
    activityLog: [],
    activeViewFile: null,
    activeRenameFile: null,
    activeDeleteFile: null,
    isServerOnline: false
  };

  // Header & Status elements
  const serverStatusBadge = document.getElementById("serverStatusBadge");
  const serverStatusText = document.getElementById("serverStatusText");
  const btnGlobalRefresh = document.getElementById("btnGlobalRefresh");

  // Summary Metrics elements
  const metricServerStatus = document.getElementById("metricServerStatus");
  const metricUptime = document.getElementById("metricUptime");
  const metricFileCount = document.getElementById("metricFileCount");
  const metricStorageUsed = document.getElementById("metricStorageUsed");
  const metricNodeStatus = document.getElementById("metricNodeStatus");
  const metricNodeVersion = document.getElementById("metricNodeVersion");

  // File Manager elements
  const fileTableBody = document.getElementById("fileTableBody");
  const fileEmptyState = document.getElementById("fileEmptyState");
  const fileSearchInput = document.getElementById("fileSearchInput");
  const btnRefreshFiles = document.getElementById("btnRefreshFiles");

  // Create File Form elements
  const createFileForm = document.getElementById("createFileForm");
  const createFileName = document.getElementById("createFileName");
  const createFileContent = document.getElementById("createFileContent");
  const charCounter = document.getElementById("charCounter");
  const btnClearCreateForm = document.getElementById("btnClearCreateForm");
  const presetChips = document.querySelectorAll(".preset-chip");

  // File System Check elements
  const checkFileForm = document.getElementById("checkFileForm");
  const checkFileNameInput = document.getElementById("checkFileNameInput");
  const checkResultBox = document.getElementById("checkResultBox");
  const checkResultIcon = document.getElementById("checkResultIcon");
  const checkResultText = document.getElementById("checkResultText");
  const checkResultSubtext = document.getElementById("checkResultSubtext");
  const quickCheckBtns = document.querySelectorAll(".quick-check-btn");

  // Modals elements
  const viewModal = document.getElementById("viewModal");
  const viewModalSubtitle = document.getElementById("viewModalSubtitle");
  const viewModalSize = document.getElementById("viewModalSize");
  const viewModalModified = document.getElementById("viewModalModified");
  const viewModalContent = document.getElementById("viewModalContent");
  const appendContentInput = document.getElementById("appendContentInput");
  const btnSubmitAppend = document.getElementById("btnSubmitAppend");
  const btnCopyFileContent = document.getElementById("btnCopyFileContent");

  const renameModal = document.getElementById("renameModal");
  const renameFileForm = document.getElementById("renameFileForm");
  const renameCurrentName = document.getElementById("renameCurrentName");
  const renameNewNameInput = document.getElementById("renameNewNameInput");

  const deleteModal = document.getElementById("deleteModal");
  const deleteTargetName = document.getElementById("deleteTargetName");
  const btnConfirmDelete = document.getElementById("btnConfirmDelete");

  // Activity Log elements
  const activityLogList = document.getElementById("activityLogList");
  const btnClearLog = document.getElementById("btnClearLog");

  // Toast Container
  const toastContainer = document.getElementById("toastContainer");

  // ==========================================================================
  // 2. Toast Notification System
  // ==========================================================================

  /**
   * Displays an animated toast message in the top-right corner.
   *
   * @param {string} message - Message text to display
   * @param {'success'|'error'|'info'} type - Toast type
   * @param {number} [duration=3500] - Duration in ms before auto-dismiss
   */
  function showToast(message, type = "info", duration = 3500) {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    let iconHtml = "ℹ";
    if (type === "success") iconHtml = "✓";
    if (type === "error") iconHtml = "✕";

    toast.innerHTML = `
      <div class="toast-icon">${iconHtml}</div>
      <div class="toast-message">${escapeHtml(message)}</div>
      <button class="toast-close" aria-label="Dismiss">&times;</button>
    `;

    toastContainer.appendChild(toast);

    // Trigger smooth slide-in
    requestAnimationFrame(() => {
      toast.classList.add("show");
    });

    const closeBtn = toast.querySelector(".toast-close");
    let timer = null;

    const removeToast = () => {
      toast.classList.remove("show");
      setTimeout(() => {
        if (toast.parentElement) toast.remove();
      }, 300);
    };

    closeBtn.addEventListener("click", () => {
      clearTimeout(timer);
      removeToast();
    });

    timer = setTimeout(removeToast, duration);
  }

  // ==========================================================================
  // 3. Activity Logging System
  // ==========================================================================

  /**
   * Appends an event to the Recent Activity list (maximum 10 entries).
   *
   * @param {string} action - Action verb (e.g. 'CREATE', 'READ', 'APPEND', 'RENAME', 'DELETE', 'CHECK')
   * @param {string} description - Details of the action
   */
  function logActivity(action, description) {
    const now = new Date();
    const timeString = now.toTimeString().split(" ")[0]; // HH:MM:SS

    const entry = {
      id: Date.now() + Math.random(),
      time: timeString,
      action: action.toUpperCase(),
      description: description
    };

    state.activityLog.unshift(entry);
    if (state.activityLog.length > 10) {
      state.activityLog.pop();
    }

    renderActivityLog();
  }

  function renderActivityLog() {
    if (state.activityLog.length === 0) {
      activityLogList.innerHTML = `<li class="activity-empty">No recent filesystem activity recorded yet.</li>`;
      return;
    }

    const badgeClassMap = {
      CREATE: "badge-success",
      READ: "badge-neutral",
      APPEND: "badge-orange",
      RENAME: "badge-purple",
      DELETE: "badge-danger",
      CHECK: "badge-neutral"
    };

    activityLogList.innerHTML = state.activityLog.map((entry) => {
      const badgeClass = badgeClassMap[entry.action] || "badge-neutral";
      return `
        <li class="activity-log-item">
          <div class="activity-item-left">
            <span class="activity-time">${entry.time}</span>
            <span class="activity-badge badge ${badgeClass}">${entry.action}</span>
            <span class="activity-desc">${escapeHtml(entry.description)}</span>
          </div>
        </li>
      `;
    }).join("");
  }

  // ==========================================================================
  // 4. Modal Helpers
  // ==========================================================================

  function openModal(modalElement) {
    modalElement.classList.add("active");
    modalElement.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal(modalElement) {
    modalElement.classList.remove("active");
    modalElement.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // Attach modal close events to backdrops and buttons
  document.querySelectorAll(".modal-backdrop").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  document.querySelectorAll(".modal-close-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const modalId = btn.getAttribute("data-close");
      const targetModal = document.getElementById(modalId);
      if (targetModal) closeModal(targetModal);
    });
  });

  // ESC key to close active modal
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const activeModal = document.querySelector(".modal-backdrop.active");
      if (activeModal) closeModal(activeModal);
    }
  });

  // ==========================================================================
  // 5. API Fetch Calls & UI Sync
  // ==========================================================================

  /**
   * Fetch server status from GET /api/status and update top summary cards
   */
  async function fetchServerStatus() {
    try {
      const response = await fetch("/api/status");
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const data = await response.json();

      if (data.success) {
        state.isServerOnline = true;
        serverStatusBadge.className = "status-badge";
        serverStatusText.textContent = "Server Online";
        metricServerStatus.textContent = "ONLINE";

        // Format uptime
        const uptimeSeconds = data.uptime || 0;
        const minutes = Math.floor(uptimeSeconds / 60);
        const seconds = uptimeSeconds % 60;
        metricUptime.textContent = `Uptime: ${minutes}m ${seconds}s`;

        metricNodeStatus.textContent = "Running";
        metricNodeVersion.textContent = data.nodeVersion || "Node.js";
      }
    } catch (err) {
      state.isServerOnline = false;
      serverStatusBadge.className = "status-badge offline";
      serverStatusText.textContent = "Server Offline";
      metricServerStatus.textContent = "OFFLINE";
      metricUptime.textContent = "Connection failed";
      metricNodeStatus.textContent = "Stopped";
      console.error("[Status Error]:", err);
    }
  }

  /**
   * Fetch all files from GET /api/files and render the table
   */
  async function fetchFiles() {
    btnGlobalRefresh.classList.add("spinning");
    try {
      const response = await fetch("/api/files");
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const data = await response.json();

      if (data.success) {
        state.files = data.files || [];
        metricFileCount.textContent = data.totalFiles !== undefined ? data.totalFiles : state.files.length;
        metricStorageUsed.textContent = data.formattedStorage || "0 B";

        renderFileTable(state.files);
      }
    } catch (err) {
      showToast("Unable to load files from server", "error");
      fileTableBody.innerHTML = `
        <tr>
          <td colspan="5" class="table-loading-cell">
            <span style="color: var(--color-danger)">✕ Failed to load files from server. Check server connection.</span>
          </td>
        </tr>
      `;
      console.error("[Fetch Files Error]:", err);
    } finally {
      setTimeout(() => {
        btnGlobalRefresh.classList.remove("spinning");
      }, 400);
    }
  }

  /**
   * Renders files into the HTML table with search filtering
   */
  function renderFileTable(fileList) {
    const searchTerm = fileSearchInput.value.trim().toLowerCase();
    const filteredFiles = fileList.filter((f) => f.filename.toLowerCase().includes(searchTerm));

    if (filteredFiles.length === 0) {
      fileTableBody.innerHTML = "";
      fileEmptyState.classList.remove("hidden");
      return;
    }

    fileEmptyState.classList.add("hidden");

    fileTableBody.innerHTML = filteredFiles.map((file) => {
      const formattedDate = file.lastModified 
        ? new Date(file.lastModified).toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          })
        : "-";

      return `
        <tr data-filename="${escapeHtml(file.filename)}">
          <td>
            <div class="file-name-cell">
              <div class="file-icon-box">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
              </div>
              <span class="file-name-text">${escapeHtml(file.filename)}</span>
            </div>
          </td>
          <td class="file-size-cell">${escapeHtml(file.formattedSize || "0 B")}</td>
          <td class="file-date-cell">${escapeHtml(formattedDate)}</td>
          <td>
            <span class="badge badge-success">Available</span>
          </td>
          <td class="text-right">
            <div class="action-buttons-group">
              <button class="btn-action btn-action-view" data-action="view" data-filename="${escapeHtml(file.filename)}" title="View file content">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <span>View</span>
              </button>
              <button class="btn-action btn-action-rename" data-action="rename" data-filename="${escapeHtml(file.filename)}" title="Rename file">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                </svg>
                <span>Rename</span>
              </button>
              <button class="btn-action btn-action-delete" data-action="delete" data-filename="${escapeHtml(file.filename)}" title="Delete file">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                <span>Delete</span>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  // ==========================================================================
  // 6. File Operations Implementations
  // ==========================================================================

  /**
   * READ: Fetch file content from GET /api/files/:filename and show preview modal
   */
  async function handleViewFile(filename) {
    state.activeViewFile = filename;
    viewModalSubtitle.textContent = filename;
    viewModalContent.textContent = "Loading file content from server...";
    viewModalSize.textContent = "...";
    viewModalModified.textContent = "...";
    appendContentInput.value = "";
    openModal(viewModal);

    try {
      const response = await fetch(`/api/files/${encodeURIComponent(filename)}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to read file.");
      }

      viewModalContent.textContent = data.content || "(Empty file)";
      viewModalSize.textContent = data.formattedSize || "0 B";
      viewModalModified.textContent = data.lastModified
        ? new Date(data.lastModified).toLocaleString()
        : "-";

      showToast(`File "${filename}" loaded successfully`, "info");
      logActivity("READ", `Read ${filename}`);
    } catch (err) {
      viewModalContent.textContent = `Error: ${err.message}`;
      showToast(err.message, "error");
    }
  }

  /**
   * APPEND: POST /api/files/:filename/append
   */
  async function handleAppendContent() {
    const filename = state.activeViewFile;
    const content = appendContentInput.value;

    if (!filename) return;

    if (!content || content.trim().length === 0) {
      showToast("Please enter some content to append.", "error");
      appendContentInput.focus();
      return;
    }

    btnSubmitAppend.disabled = true;
    btnSubmitAppend.textContent = "Appending...";

    try {
      const response = await fetch(`/api/files/${encodeURIComponent(filename)}/append`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to append content.");
      }

      showToast(data.message || `Appended content to ${filename}`, "success");
      logActivity("APPEND", `Appended content to ${filename}`);

      // Clear input and reload preview & file list
      appendContentInput.value = "";
      await handleViewFile(filename);
      fetchFiles();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      btnSubmitAppend.disabled = false;
      btnSubmitAppend.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span>Append Content</span>
      `;
    }
  }

  /**
   * CREATE: POST /api/files
   */
  createFileForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const filename = createFileName.value.trim();
    const content = createFileContent.value;

    // Client-side validations
    if (!filename) {
      showToast("Please enter a valid file name.", "error");
      createFileName.focus();
      return;
    }

    if (!content || content.trim().length === 0) {
      showToast("File content cannot be empty.", "error");
      createFileContent.focus();
      return;
    }

    const btnSubmit = document.getElementById("btnSubmitCreateFile");
    btnSubmit.disabled = true;
    btnSubmit.textContent = "Creating...";

    try {
      const response = await fetch("/api/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename, content })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to create file.");
      }

      showToast(`File created successfully`, "success");
      logActivity("CREATE", `Created ${filename}`);

      // Reset form
      createFileName.value = "";
      createFileContent.value = "";
      charCounter.textContent = "0 characters";

      // Refresh list & stats
      fetchFiles();
      fetchServerStatus();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
          <polyline points="17 21 17 13 7 13 7 21"></polyline>
          <polyline points="7 3 7 8 15 8"></polyline>
        </svg>
        <span>Create File</span>
      `;
    }
  });

  /**
   * RENAME: Open Rename Modal & handle submit via PUT /api/files/:filename
   */
  function handleOpenRenameModal(filename) {
    state.activeRenameFile = filename;
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

    const currentFilename = state.activeRenameFile;
    const newFilename = renameNewNameInput.value.trim();

    if (!newFilename) {
      showToast("Please enter a new filename.", "error");
      renameNewNameInput.focus();
      return;
    }

    if (newFilename === currentFilename) {
      showToast("New filename is identical to current name.", "error");
      return;
    }

    const btnSubmit = document.getElementById("btnSubmitRename");
    btnSubmit.disabled = true;
    btnSubmit.textContent = "Renaming...";

    try {
      const response = await fetch(`/api/files/${encodeURIComponent(currentFilename)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newFilename })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to rename file.");
      }

      showToast(`File renamed to "${newFilename}" successfully`, "success");
      logActivity("RENAME", `Renamed ${currentFilename} → ${newFilename}`);

      closeModal(renameModal);
      fetchFiles();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.textContent = "Rename File";
    }
  });

  /**
   * DELETE: Open Delete Confirmation Modal & handle DELETE /api/files/:filename
   */
  function handleOpenDeleteModal(filename) {
    state.activeDeleteFile = filename;
    deleteTargetName.textContent = filename;
    openModal(deleteModal);
  }

  btnConfirmDelete.addEventListener("click", async () => {
    const filename = state.activeDeleteFile;
    if (!filename) return;

    btnConfirmDelete.disabled = true;
    btnConfirmDelete.textContent = "Deleting...";

    try {
      const response = await fetch(`/api/files/${encodeURIComponent(filename)}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to delete file");
      }

      showToast(`File "${filename}" deleted successfully`, "success");
      logActivity("DELETE", `Deleted ${filename}`);

      closeModal(deleteModal);
      fetchFiles();
      fetchServerStatus();
    } catch (err) {
      showToast(err.message || "Unable to delete file", "error");
    } finally {
      btnConfirmDelete.disabled = false;
      btnConfirmDelete.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
        <span>Delete File</span>
      `;
    }
  });

  /**
   * CHECK FILE EXISTENCE: GET /api/files/:filename/exists
   */
  async function checkFileExistence(filename) {
    if (!filename || filename.trim().length === 0) {
      showToast("Please enter a filename to check.", "error");
      checkFileNameInput.focus();
      return;
    }

    const trimmed = filename.trim();
    checkResultBox.className = "check-result-box neutral";
    checkResultText.textContent = "Checking...";
    checkResultSubtext.textContent = "Querying server filesystem...";

    try {
      const response = await fetch(`/api/files/${encodeURIComponent(trimmed)}/exists`);
      const data = await response.json();

      if (data.exists) {
        checkResultBox.className = "check-result-box exists";
        checkResultIcon.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        `;
        checkResultText.textContent = "✓ File exists";
        checkResultSubtext.textContent = `Found in server-data/${trimmed}`;
        logActivity("CHECK", `Verified existence: ${trimmed} (Exists)`);
      } else {
        checkResultBox.className = "check-result-box not-exists";
        checkResultIcon.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        `;
        checkResultText.textContent = "✕ File does not exist";
        checkResultSubtext.textContent = `No file named "${trimmed}" in server-data/`;
        logActivity("CHECK", `Verified existence: ${trimmed} (Not found)`);
      }
    } catch (err) {
      checkResultBox.className = "check-result-box not-exists";
      checkResultText.textContent = "✕ Check failed";
      checkResultSubtext.textContent = err.message;
      showToast("Failed to verify file existence", "error");
    }
  }

  // ==========================================================================
  // 7. Event Listeners & Interactive Handlers
  // ==========================================================================

  // Delegated table action clicks (View, Rename, Delete)
  fileTableBody.addEventListener("click", (e) => {
    const button = e.target.closest(".btn-action");
    if (!button) return;

    const action = button.getAttribute("data-action");
    const filename = button.getAttribute("data-filename");

    if (action === "view") {
      handleViewFile(filename);
    } else if (action === "rename") {
      handleOpenRenameModal(filename);
    } else if (action === "delete") {
      handleOpenDeleteModal(filename);
    }
  });

  // Append button in view modal
  btnSubmitAppend.addEventListener("click", handleAppendContent);

  // Copy file content button in view modal
  btnCopyFileContent.addEventListener("click", () => {
    const text = viewModalContent.textContent;
    navigator.clipboard.writeText(text).then(() => {
      showToast("Content copied to clipboard", "info");
    }).catch(() => {
      showToast("Failed to copy content", "error");
    });
  });

  // Quick Preset Chips for Create File
  presetChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const name = chip.getAttribute("data-name");
      const content = chip.getAttribute("data-content");
      createFileName.value = name;
      createFileContent.value = content;
      charCounter.textContent = `${content.length} characters`;
      showToast(`Loaded preset "${name}"`, "info");
    });
  });

  // Character Counter for Create File Textarea
  createFileContent.addEventListener("input", () => {
    const len = createFileContent.value.length;
    charCounter.textContent = `${len} characters`;
  });

  // Clear Create Form
  btnClearCreateForm.addEventListener("click", () => {
    createFileName.value = "";
    createFileContent.value = "";
    charCounter.textContent = "0 characters";
    createFileName.focus();
  });

  // Search input filtering
  fileSearchInput.addEventListener("input", () => {
    renderFileTable(state.files);
  });

  // Check File Form Submit
  checkFileForm.addEventListener("submit", (e) => {
    e.preventDefault();
    checkFileExistence(checkFileNameInput.value);
  });

  // Quick check chips
  quickCheckBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-target");
      checkFileNameInput.value = target;
      checkFileExistence(target);
    });
  });

  // Refresh buttons
  btnGlobalRefresh.addEventListener("click", () => {
    fetchServerStatus();
    fetchFiles();
    showToast("Refreshing data from server...", "info");
  });

  btnRefreshFiles.addEventListener("click", () => {
    fetchFiles();
  });

  // Clear Activity Log
  btnClearLog.addEventListener("click", () => {
    state.activityLog = [];
    renderActivityLog();
    showToast("Activity log cleared", "info");
  });

  // Optional: Clicking endpoint items copies path or runs a quick preview
  document.querySelectorAll(".endpoint-item").forEach((item) => {
    item.addEventListener("click", () => {
      const path = item.querySelector(".endpoint-path").textContent;
      navigator.clipboard.writeText(path).then(() => {
        showToast(`Copied route ${path} to clipboard`, "info");
      });
    });
  });

  // Helper: Escape HTML to prevent XSS
  function escapeHtml(text) {
    if (!text) return "";
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // ==========================================================================
  // 8. Initial App Boot
  // ==========================================================================
  function initApp() {
    renderActivityLog();
    fetchServerStatus();
    fetchFiles();

    // Auto-refresh status periodically every 30 seconds
    setInterval(fetchServerStatus, 30000);
  }

  initApp();
});
