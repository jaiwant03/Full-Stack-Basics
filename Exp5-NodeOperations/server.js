/**
 * ============================================================================
 * NodeFile Server - Main Application Server
 * ============================================================================
 * Description: Express.js web server demonstrating core Node.js file system
 *              operations using the built-in 'fs' and 'path' modules.
 * College Practical / Assignment Demonstration
 * Port: 5000 (http://localhost:5000)
 * ============================================================================
 */

// 1. Core Module Imports
// Express.js framework for routing, serving static files, and building REST APIs
const express = require("express");
// Node.js built-in 'fs' module provides methods for interacting with the file system
const fs = require("fs");
// Node.js built-in 'path' module provides utilities for working with file and directory paths
const path = require("path");

// 2. Application Initialization
const app = express();
const PORT = process.env.PORT || 5000;

// Absolute path to the dedicated storage folder for all demonstration files
const DATA_DIR = path.join(__dirname, "server-data");

// Ensure the storage directory exists on startup using fs.existsSync and fs.mkdirSync
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  console.log(`[Storage] Created dedicated folder: ${DATA_DIR}`);
}

// 3. Built-in Middleware Configuration
// Parse incoming requests with JSON payloads (Content-Type: application/json)
app.use(express.json());

// Parse incoming requests with URL-encoded payloads
app.use(express.urlencoded({ extended: true }));

// Serve static frontend assets (HTML, CSS, JS, images) from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Simple request logger for tracking API requests in the terminal
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// ============================================================================
// 4. Security & Validation Helper Functions
// ============================================================================

/**
 * Validates a filename to prevent Path Traversal attacks and ensure cross-platform safety.
 * Rejects path separators ('/', '\'), parent references ('..'), and forbidden characters.
 *
 * @param {string} filename - The filename to validate
 * @returns {boolean} - True if filename is safe and valid
 */
function isSafeFilename(filename) {
  if (!filename || typeof filename !== "string") return false;

  const trimmed = filename.trim();
  if (trimmed.length === 0 || trimmed.length > 255) return false;

  // Disallow directory traversal characters
  if (trimmed.includes("..") || trimmed.includes("/") || trimmed.includes("\\")) {
    return false;
  }

  // Disallow forbidden filename characters on Windows and POSIX: < > : " / \ | ? * and control chars
  const forbiddenCharsRegex = /[<>:"/\\|?\x00-\x1F]/;
  if (forbiddenCharsRegex.test(trimmed)) {
    return false;
  }

  // Disallow reserved Windows device names (CON, PRN, AUX, NUL, COM1-9, LPT1-9)
  const baseName = trimmed.split(".")[0].toUpperCase();
  const reservedNames = [
    "CON", "PRN", "AUX", "NUL",
    "COM1", "COM2", "COM3", "COM4", "COM5", "COM6", "COM7", "COM8", "COM9",
    "LPT1", "LPT2", "LPT3", "LPT4", "LPT5", "LPT6", "LPT7", "LPT8", "LPT9"
  ];
  if (reservedNames.includes(baseName)) {
    return false;
  }

  return true;
}

/**
 * Resolves a filename to an absolute path inside DATA_DIR and verifies it does not escape.
 *
 * @param {string} filename - The user-provided filename
 * @returns {string|null} - Absolute path if safe, or null if invalid
 */
function getSafeFilePath(filename) {
  if (!isSafeFilename(filename)) {
    return null;
  }

  // path.join securely creates a path using system-specific separators
  const resolvedPath = path.resolve(DATA_DIR, filename.trim());

  // Strict verification: the resolved path MUST stay inside DATA_DIR
  const normalizedDataDir = path.resolve(DATA_DIR);
  if (!resolvedPath.startsWith(normalizedDataDir + path.sep)) {
    return null;
  }

  return resolvedPath;
}

/**
 * Formats a byte size into human-readable units (B, KB, MB).
 *
 * @param {number} bytes - Size in bytes
 * @returns {string} - Formatted size string
 */
function formatFileSize(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// ============================================================================
// 5. REST API Endpoints
// ============================================================================

/**
 * @route   GET /api/status
 * @desc    Returns server operational status, node version, and uptime
 */
app.get("/api/status", (req, res) => {
  return res.json({
    success: true,
    message: "Node.js server is running",
    server: "NodeFile Server",
    nodeVersion: process.version,
    uptime: Math.floor(process.uptime()),
    platform: process.platform,
    port: PORT
  });
});

/**
 * @route   GET /api/files
 * @desc    Lists all files in server-data/ using fs.readdir and fs.stat
 */
app.get("/api/files", (req, res) => {
  // fs.readdir reads the contents of the given directory asynchronously
  fs.readdir(DATA_DIR, (err, fileList) => {
    if (err) {
      console.error("[Error fs.readdir]:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to read server data directory",
        error: err.message
      });
    }

    let files = [];
    let totalStorage = 0;

    fileList.forEach((filename) => {
      const filePath = path.join(DATA_DIR, filename);

      try {
        // fs.statSync retrieves file metadata synchronously (size, modified time, etc.)
        const stats = fs.statSync(filePath);

        // Only include regular files (ignore directories or hidden items)
        if (stats.isFile()) {
          totalStorage += stats.size;
          files.push({
            filename: filename,
            size: stats.size,
            formattedSize: formatFileSize(stats.size),
            lastModified: stats.mtime,
            createdAt: stats.birthtime,
            extension: path.extname(filename).toLowerCase() || "none"
          });
        }
      } catch (statErr) {
        console.warn(`Could not stat file: ${filename}`, statErr.message);
      }
    });

    // Sort files alphabetically by name
    files.sort((a, b) => a.filename.localeCompare(b.filename));

    return res.json({
      success: true,
      files: files,
      totalFiles: files.length,
      totalStorage: totalStorage,
      formattedStorage: formatFileSize(totalStorage)
    });
  });
});

/**
 * @route   GET /api/files/:filename
 * @desc    Reads and returns the contents of a specific file using fs.readFile
 */
app.get("/api/files/:filename", (req, res) => {
  const { filename } = req.params;
  const safePath = getSafeFilePath(filename);

  if (!safePath) {
    return res.status(400).json({
      success: false,
      message: "Invalid or unauthorized filename."
    });
  }

  // fs.existsSync checks synchronously if a file exists on the filesystem
  if (!fs.existsSync(safePath)) {
    return res.status(404).json({
      success: false,
      message: `File "${filename}" not found.`
    });
  }

  // fs.readFile reads the entire contents of a file asynchronously
  fs.readFile(safePath, "utf8", (err, content) => {
    if (err) {
      console.error("[Error fs.readFile]:", err);
      return res.status(500).json({
        success: false,
        message: `Failed to read file "${filename}".`,
        error: err.message
      });
    }

    try {
      const stats = fs.statSync(safePath);
      return res.json({
        success: true,
        filename: filename,
        content: content,
        size: stats.size,
        formattedSize: formatFileSize(stats.size),
        lastModified: stats.mtime
      });
    } catch (statErr) {
      return res.json({
        success: true,
        filename: filename,
        content: content,
        size: Buffer.byteLength(content, "utf8"),
        formattedSize: formatFileSize(Buffer.byteLength(content, "utf8")),
        lastModified: new Date()
      });
    }
  });
});

/**
 * @route   POST /api/files
 * @desc    Creates a new file using fs.writeFile
 * @body    { filename: string, content: string }
 */
app.post("/api/files", (req, res) => {
  const { filename, content } = req.body;

  // Validation: Missing or empty filename
  if (!filename || typeof filename !== "string" || filename.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "Filename is required and cannot be empty."
    });
  }

  // Validation: Missing content
  if (content === undefined || content === null || (typeof content === "string" && content.trim().length === 0)) {
    return res.status(400).json({
      success: false,
      message: "File content cannot be empty."
    });
  }

  const safePath = getSafeFilePath(filename);
  if (!safePath) {
    return res.status(400).json({
      success: false,
      message: "Invalid filename. Avoid special characters, slashes, or path traversal sequences."
    });
  }

  // Check for duplicate file to prevent accidental overwrite during creation
  if (fs.existsSync(safePath)) {
    return res.status(409).json({
      success: false,
      message: `A file named "${filename}" already exists. Please choose a different name.`
    });
  }

  // fs.writeFile writes data to the specified file asynchronously.
  // If file doesn't exist, it is created.
  fs.writeFile(safePath, content, "utf8", (err) => {
    if (err) {
      console.error("[Error fs.writeFile]:", err);
      return res.status(500).json({
        success: false,
        message: `Failed to create file "${filename}".`,
        error: err.message
      });
    }

    return res.status(201).json({
      success: true,
      message: `File "${filename}" created successfully.`,
      filename: filename
    });
  });
});

/**
 * @route   POST /api/files/:filename/append
 * @desc    Appends content to an existing file using fs.appendFile
 * @body    { content: string }
 */
app.post("/api/files/:filename/append", (req, res) => {
  const { filename } = req.params;
  const { content } = req.body;

  if (content === undefined || content === null || (typeof content === "string" && content.trim().length === 0)) {
    return res.status(400).json({
      success: false,
      message: "Content to append cannot be empty."
    });
  }

  const safePath = getSafeFilePath(filename);
  if (!safePath) {
    return res.status(400).json({
      success: false,
      message: "Invalid or unauthorized filename."
    });
  }

  // Verify that the file exists before appending
  if (!fs.existsSync(safePath)) {
    return res.status(404).json({
      success: false,
      message: `File "${filename}" does not exist. Cannot append content.`
    });
  }

  // Prepare content: prepend a newline if content doesn't already start with one
  const contentToAppend = content.startsWith("\n") ? content : `\n${content}`;

  // fs.appendFile asynchronously appends data to a file, creating the file if it does not yet exist
  fs.appendFile(safePath, contentToAppend, "utf8", (err) => {
    if (err) {
      console.error("[Error fs.appendFile]:", err);
      return res.status(500).json({
        success: false,
        message: `Failed to append to file "${filename}".`,
        error: err.message
      });
    }

    return res.json({
      success: true,
      message: `Content appended to "${filename}" successfully.`,
      filename: filename
    });
  });
});

/**
 * @route   PUT /api/files/:filename
 * @desc    Renames an existing file using fs.rename
 * @body    { newFilename: string }
 */
app.put("/api/files/:filename", (req, res) => {
  const { filename } = req.params;
  const { newFilename } = req.body;

  // Validation: Missing or empty newFilename
  if (!newFilename || typeof newFilename !== "string" || newFilename.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "New filename is required and cannot be empty."
    });
  }

  const oldSafePath = getSafeFilePath(filename);
  const newSafePath = getSafeFilePath(newFilename);

  if (!oldSafePath || !newSafePath) {
    return res.status(400).json({
      success: false,
      message: "Invalid filename format for current or new file name."
    });
  }

  // Check if source file exists
  if (!fs.existsSync(oldSafePath)) {
    return res.status(404).json({
      success: false,
      message: `File "${filename}" not found.`
    });
  }

  // If newFilename is identical to old filename, no-op
  if (filename === newFilename.trim()) {
    return res.status(400).json({
      success: false,
      message: "The new filename is identical to the current filename."
    });
  }

  // Check if a file with the target new name already exists
  if (fs.existsSync(newSafePath)) {
    return res.status(409).json({
      success: false,
      message: `A file named "${newFilename}" already exists. Please choose a different name.`
    });
  }

  // fs.rename asynchronously renames or moves a file from oldPath to newPath
  fs.rename(oldSafePath, newSafePath, (err) => {
    if (err) {
      console.error("[Error fs.rename]:", err);
      return res.status(500).json({
        success: false,
        message: `Failed to rename file "${filename}".`,
        error: err.message
      });
    }

    return res.json({
      success: true,
      message: `File renamed from "${filename}" to "${newFilename}" successfully.`,
      oldFilename: filename,
      newFilename: newFilename.trim()
    });
  });
});

/**
 * @route   DELETE /api/files/:filename
 * @desc    Deletes a file using fs.unlink
 */
app.delete("/api/files/:filename", (req, res) => {
  const { filename } = req.params;
  const safePath = getSafeFilePath(filename);

  if (!safePath) {
    return res.status(400).json({
      success: false,
      message: "Invalid or unauthorized filename."
    });
  }

  // Check if file exists
  if (!fs.existsSync(safePath)) {
    return res.status(404).json({
      success: false,
      message: `File "${filename}" not found.`
    });
  }

  // fs.unlink asynchronously removes a file or symbolic link
  fs.unlink(safePath, (err) => {
    if (err) {
      console.error("[Error fs.unlink]:", err);
      return res.status(500).json({
        success: false,
        message: `Failed to delete file "${filename}".`,
        error: err.message
      });
    }

    return res.json({
      success: true,
      message: `File "${filename}" deleted successfully.`,
      filename: filename
    });
  });
});

/**
 * @route   GET /api/files/:filename/exists
 * @desc    Checks if a file exists on the filesystem using fs.existsSync
 */
app.get("/api/files/:filename/exists", (req, res) => {
  const { filename } = req.params;

  if (!isSafeFilename(filename)) {
    return res.json({
      success: true,
      filename: filename,
      exists: false,
      message: "Invalid filename format"
    });
  }

  const safePath = getSafeFilePath(filename);
  if (!safePath) {
    return res.json({
      success: true,
      filename: filename,
      exists: false
    });
  }

  // fs.existsSync returns true if path exists, false otherwise
  const exists = fs.existsSync(safePath);

  return res.json({
    success: true,
    filename: filename,
    exists: exists,
    message: exists ? "File exists in server-data/" : "File does not exist"
  });
});

// ============================================================================
// 6. Fallback & Global Error Handlers
// ============================================================================

// 404 handler for unmatched API routes
app.all("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.method} ${req.originalUrl} not found.`
  });
});

// Global Express error handling middleware
app.use((err, req, res, next) => {
  console.error("[Global Server Error]:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error occurred.",
    error: err.message
  });
});

// ============================================================================
// 7. Server Listener
// ============================================================================
app.listen(PORT, () => {
  console.log("==================================================");
  console.log("🚀 NodeFile Server is running!");
  console.log(`📡 Local URL: http://localhost:${PORT}`);
  console.log(`📁 Server Storage Folder: ${DATA_DIR}`);
  console.log("==================================================");
});
