# 📁 NodeFile Server

A complete, beginner-friendly **Node.js Web Server & File System Operations** demonstration application. Built for academic practicals, lab demonstrations, and learning core backend concepts in Node.js and Express.

---

## 📑 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technologies Used](#2-technologies-used)
3. [Project Structure](#3-project-structure)
4. [Installation & Setup](#4-installation--setup)
5. [Starting the Server](#5-starting-the-server)
6. [API Endpoints Reference](#6-api-endpoints-reference)
7. [File Operations Demonstrated](#7-file-operations-demonstrated)
8. [Frontend-Backend Communication](#8-frontend-backend-communication)
9. [Understanding Node.js `fs` Module](#9-understanding-nodejs-fs-module)
10. [Understanding Express.js](#10-understanding-expressjs)
11. [How to Test the Project](#11-how-to-test-the-project)
12. [Security & Path Traversal Protection](#12-security--path-traversal-protection)

---

## 1. Project Overview

**NodeFile Server** demonstrates how a modern Node.js web server receives HTTP requests from a client web application, performs real asynchronous and synchronous file operations on the host filesystem, and returns structured JSON responses.

### Key Capabilities:
- **Web Server:** Express.js HTTP server serving static frontend files and exposing RESTful JSON endpoints.
- **File System Operations:** Real-time file creation, reading, appending, renaming, deletion, and existence checking inside a dedicated, isolated `server-data/` folder.
- **Developer Dashboard:** Polished, responsive White + Orange user interface built with semantic HTML5, vanilla CSS3, and vanilla JavaScript without heavy frameworks.

---

## 2. Technologies Used

- **HTML5:** Semantic document structure, dialog modals, forms, and accessibility.
- **CSS3:** Custom properties (CSS variables), Flexbox, CSS Grid, animations, and responsive media queries.
- **Vanilla JavaScript (ES6+):** Async/Await, Fetch API, DOM manipulation, event delegation, and toast notifications.
- **Node.js (v18+ or v20+):** JavaScript server runtime environment.
- **Express.js (v4.x):** Minimalist web application framework for routing and middleware.
- **Node.js `fs` Module:** Built-in module for file manipulation.
- **Node.js `path` Module:** Cross-platform path resolution and normalization.

---

## 3. Project Structure

```text
nodefile-server/
│
├── server.js               # Main Express web server & REST API logic
├── package.json            # Project dependencies and npm scripts
├── README.md               # Comprehensive documentation and student guide
│
├── server-data/            # Dedicated sandbox storage folder
│   └── sample.txt          # Pre-populated demonstration file
│
└── public/                 # Static frontend assets served by Express
    ├── index.html          # Dashboard HTML interface
    ├── style.css           # Custom White + Orange design system
    └── script.js           # Client-side API caller & DOM manager
```

---

## 4. Installation & Setup

1. Open your terminal or command prompt in the project root directory:
   ```bash
   cd "Exp5-NodeOperations"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

---

## 5. Starting the Server

To launch the server in production mode:
```bash
npm start
```

Or run in development watch mode (automatically restarts on file edits in Node 18+):
```bash
npm run dev
```

The server will start on:
```text
http://localhost:5000
```

Open your browser and navigate to `http://localhost:5000` to interact with the dashboard.

---

## 6. API Endpoints Reference

All endpoints return JSON responses with a consistent `{ success: boolean, message?: string, ... }` format:

| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/status` | Server health, platform, uptime & Node version | None |
| `GET` | `/api/files` | List all files in `server-data/` with sizes & dates | None |
| `GET` | `/api/files/:filename` | Read and return file content (`fs.readFile`) | None |
| `POST` | `/api/files` | Create a new file (`fs.writeFile`) | `{"filename": "name.txt", "content": "..."}` |
| `POST` | `/api/files/:filename/append` | Append content to existing file (`fs.appendFile`) | `{"content": "..."}` |
| `PUT` | `/api/files/:filename` | Rename an existing file (`fs.rename`) | `{"newFilename": "newName.txt"}` |
| `DELETE` | `/api/files/:filename` | Delete file from disk (`fs.unlink`) | None |
| `GET` | `/api/files/:filename/exists` | Check file existence (`fs.existsSync`) | None |

---

## 7. File Operations Demonstrated

Each core operation maps directly to a standard method provided by the Node.js `fs` module:

### 1. Create File (`fs.writeFile`)
Writes data to a new file asynchronously. If the file already exists, our endpoint protects against accidental overwrites by returning HTTP 409 Conflict.
```javascript
fs.writeFile(filePath, content, "utf8", (err) => {
  if (err) throw err;
  console.log("File created successfully!");
});
```

### 2. Read File (`fs.readFile`)
Asynchronously reads the complete contents of a file encoded in UTF-8.
```javascript
fs.readFile(filePath, "utf8", (err, data) => {
  if (err) throw err;
  console.log("File content:", data);
});
```

### 3. Append to File (`fs.appendFile`)
Appends new text content to the end of an existing file without deleting its existing contents.
```javascript
fs.appendFile(filePath, "\n" + newContent, "utf8", (err) => {
  if (err) throw err;
  console.log("Content appended successfully!");
});
```

### 4. Rename File (`fs.rename`)
Renames or moves a file from an old path to a new path.
```javascript
fs.rename(oldPath, newPath, (err) => {
  if (err) throw err;
  console.log("File renamed successfully!");
});
```

### 5. Delete File (`fs.unlink`)
Deletes (unlinks) a file permanently from the file system.
```javascript
fs.unlink(filePath, (err) => {
  if (err) throw err;
  console.log("File deleted successfully!");
});
```

### 6. Check File Existence (`fs.existsSync`)
Synchronously tests whether the specified file path exists on the filesystem and returns a boolean (`true` or `false`).
```javascript
const exists = fs.existsSync(filePath);
console.log("Does file exist?", exists);
```

### 7. Directory Listing (`fs.readdir` & `fs.statSync`)
Reads all entry names within a folder and fetches individual metadata (byte size, modification date) using `fs.statSync`.
```javascript
fs.readdir(directoryPath, (err, files) => {
  files.forEach(file => {
    const stats = fs.statSync(path.join(directoryPath, file));
    console.log(file, stats.size, stats.mtime);
  });
});
```

---

## 8. Frontend-Backend Communication

1. **User Action:** The user fills a form or clicks an action button (e.g., "Create File", "Delete", or "View").
2. **Fetch API:** The frontend sends an asynchronous HTTP request using JavaScript `fetch()`:
   ```javascript
   const response = await fetch('/api/files', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ filename: 'notes.txt', content: 'Hello world' })
   });
   const data = await response.json();
   ```
3. **Express Middleware:** Express parses the incoming JSON body via `express.json()`.
4. **Filesystem Execution:** Express executes the requested Node.js `fs` function inside `server-data/`.
5. **JSON Response:** Express sends back an appropriate HTTP status code (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, or `409 Conflict`) with descriptive JSON.
6. **UI Update:** The client updates the table, refreshes metrics, shows a toast notification, and logs the operation in the "Recent Activity" panel.

---

## 9. Understanding Node.js `fs` Module

The Node.js File System (`fs`) module provides access to physical file operations.
- **Asynchronous vs Synchronous:** 
  - Asynchronous methods (e.g., `fs.readFile`, `fs.writeFile`, `fs.unlink`) take a callback function or return promises and do not block the Node.js single-threaded event loop.
  - Synchronous methods (e.g., `fs.existsSync`, `fs.statSync`) block execution until completion. They are helpful during initialization or for fast checks.
- **Streams & Buffers:** Under the hood, files are read into binary buffers. Specifying `"utf8"` as the encoding automatically decodes binary data into readable JavaScript strings.

---

## 10. Understanding Express.js

Express is the de-facto standard web framework for Node.js. In this project:
- `express()` creates an application instance.
- `app.use(express.static('public'))` automatically serves frontend assets (HTML, CSS, JS) without writing manual MIME type handlers.
- `app.use(express.json())` parses request payloads so `req.body` contains parsed JavaScript objects.
- `app.get()`, `app.post()`, `app.put()`, and `app.delete()` define RESTful route handlers mapped to standard HTTP methods.

---

## 11. How to Test the Project

Follow these steps for a complete demonstration:

1. **Verify Server Status:**
   - Observe the top summary cards: "Server Status" should show **ONLINE** with active uptime.
   - The status badge in the header shows **● Server Online**.

2. **Check Pre-Loaded Sample File:**
   - Look at the **File Manager** table: `sample.txt` should be listed with its size and modification date.

3. **Read / View a File:**
   - Click the orange **View** button next to `sample.txt`.
   - The preview modal opens displaying the file's contents, size, and last modified date.

4. **Append Content to a File:**
   - In the View modal, scroll down to **Append Content**.
   - Type `Appended test line from dashboard.` and click **Append Content**.
   - Observe the preview update immediately with the new line and a success toast appearing.

5. **Create a New File:**
   - In the **Create / Write File** card, enter:
     - File Name: `student_demo.txt`
     - Content: `This is a test file created from the browser.`
     - (Or click one of the quick preset chips: Plain Text, JSON Data, or Markdown).
   - Click **Create File**.
   - Notice the toast `File created successfully`, the dynamic file counter incrementing, and the new file appearing in the table.

6. **Rename a File:**
   - Click **Rename** on `student_demo.txt`.
   - Change the name to `renamed_demo.txt` and click **Rename File**.
   - The table updates immediately to show the new name.

7. **Check File Existence:**
   - In the **File System Check** card, type `renamed_demo.txt` and click **Check**.
   - Result: `✓ File exists`.
   - Now click the `missing.txt` chip and click **Check**.
   - Result: `✕ File does not exist`.

8. **Delete a File:**
   - Click the red **Delete** button on `renamed_demo.txt`.
   - Confirm in the confirmation modal.
   - The file is unlinked from disk, the table refreshes, and the storage count decreases.

9. **Verify Error Handling:**
   - Try to create a file with an empty name or empty content -> client validation prevents submission with an error toast.
   - Try to create a duplicate file named `sample.txt` -> server returns HTTP 409 with an error toast.

---

## 12. Security & Path Traversal Protection

To safeguard the host machine, the application implements strict security guards:
1. **Filename Sanitization:** All incoming filenames are inspected. Slashes (`/` and `\`), directory climbing sequences (`..`), null bytes, and illegal Windows/POSIX characters are rejected with HTTP 400.
2. **Path Confinement:** Every file path is resolved via `path.resolve(DATA_DIR, filename)`. The server strictly asserts that the resulting absolute path begins with the normalized `server-data/` folder path.
3. **No Arbitrary Execution:** Only standard text and data files within the sandbox are touched.
