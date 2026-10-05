# Static JSON API

## Project Title
**Static JSON API Server** – A Node.js + Express application that serves static JSON data through REST API endpoints.

---

## Project Objective
Demonstrate how a Node.js web server can serve structured JSON data via REST API endpoints, and how a browser-based frontend can consume that data using `fetch()`.

---

## Technologies Used

| Layer    | Technology                 |
|----------|----------------------------|
| Runtime  | Node.js                    |
| Server   | Express.js                 |
| Language | JavaScript (ES6+)          |
| Data     | Static JSON file           |
| Frontend | HTML, CSS, Vanilla JS      |

---

## Project Structure

```
static-json-api/
│
├── server.js           ← Express server (entry point)
├── package.json        ← Project metadata & dependencies
├── data/
│   └── products.json   ← Static JSON data (10 products)
├── public/
│   ├── index.html      ← Frontend page
│   ├── style.css       ← Styling (white + orange theme)
│   └── script.js       ← Frontend JavaScript (fetch & display)
└── README.md           ← This file
```

---

## Installation

Make sure **Node.js** is installed on your machine. Then run:

```bash
npm install
```

This installs the only dependency: **Express.js**.

---

## How to Run

```bash
npm start
```

Then open your browser and navigate to:

```
http://localhost:5000
```

> **Development mode** (auto-restarts on file change — Node.js v18+):
> ```bash
> npm run dev
> ```

---

## API Endpoints

| Method | Endpoint             | Description                        |
|--------|----------------------|------------------------------------|
| GET    | `/api/status`        | Check if the API server is running |
| GET    | `/api/products`      | Get all products                   |
| GET    | `/api/products/:id`  | Get a single product by ID         |

---

## Example API Responses

### GET /api/status
```json
{
  "status": "success",
  "message": "Static JSON API is running",
  "server": "Node.js + Express",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### GET /api/products
```json
{
  "status": "success",
  "count": 10,
  "data": [
    {
      "id": 1,
      "name": "Wireless Headphones",
      "category": "Electronics",
      "price": 2499,
      "stock": 25
    }
  ]
}
```

### GET /api/products/1
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Wireless Headphones",
    "category": "Electronics",
    "price": 2499,
    "stock": 25
  }
}
```

### GET /api/products/999 (not found)
```json
{
  "status": "error",
  "message": "Product not found with ID: 999"
}
```

---

## How the Project Works

```
JSON File (data/products.json)
         ↓
Node.js + Express (server.js)
         ↓
REST API endpoints (/api/*)
         ↓
Browser (public/index.html + script.js)
```

1. **`server.js`** reads `data/products.json` using Node.js `fs` module.
2. **Express** exposes REST API endpoints that return the JSON data.
3. The **frontend** (`script.js`) uses `fetch()` to call the API endpoints.
4. Responses are displayed in a JSON viewer with syntax highlighting.

---

## HTTP Status Codes

| Code | Meaning                |
|------|------------------------|
| 200  | Success                |
| 400  | Bad request (invalid ID) |
| 404  | Product / route not found |
| 500  | Internal server error  |

---

*Built with Node.js + Express as an academic demonstration of REST API concepts.*
