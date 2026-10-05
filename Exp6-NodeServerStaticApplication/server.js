const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5000;

// ─── Middleware ────────────────────────────────────────────────────────────────

// Parse incoming JSON request bodies
app.use(express.json());

// Serve static frontend files from the /public directory
app.use(express.static(path.join(__dirname, "public")));

// ─── Helper: Read Products JSON ────────────────────────────────────────────────

function readProducts() {
  const filePath = path.join(__dirname, "data", "products.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

// ─── API Routes ────────────────────────────────────────────────────────────────

// GET /api/status – Check API server status
app.get("/api/status", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Static JSON API is running",
    server: "Node.js + Express",
    timestamp: new Date().toISOString(),
  });
});

// GET /api/products – Return all products
app.get("/api/products", (req, res) => {
  try {
    const products = readProducts();
    res.status(200).json({
      status: "success",
      count: products.length,
      data: products,
    });
  } catch (err) {
    console.error("Error reading products:", err.message);
    res.status(500).json({
      status: "error",
      message: "Internal server error while reading products",
    });
  }
});

// GET /api/products/:id – Return a single product by ID
app.get("/api/products/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    // Validate that :id is a valid number
    if (isNaN(id)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid product ID. ID must be a number.",
      });
    }

    const products = readProducts();
    const product = products.find((p) => p.id === id);

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: `Product not found with ID: ${id}`,
      });
    }

    res.status(200).json({
      status: "success",
      data: product,
    });
  } catch (err) {
    console.error("Error reading product by ID:", err.message);
    res.status(500).json({
      status: "error",
      message: "Internal server error while reading product",
    });
  }
});

// ─── Unknown API Routes – 404 Handler ─────────────────────────────────────────

app.use("/api/*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: `API route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ─── Catch-all: Serve Frontend for Non-API Routes ─────────────────────────────

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ─── Start Server ──────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log("─────────────────────────────────────────");
  console.log(`  Static JSON API Server`);
  console.log(`  Running at: http://localhost:${PORT}`);
  console.log("─────────────────────────────────────────");
  console.log(`  GET  http://localhost:${PORT}/api/status`);
  console.log(`  GET  http://localhost:${PORT}/api/products`);
  console.log(`  GET  http://localhost:${PORT}/api/products/:id`);
  console.log("─────────────────────────────────────────");
});
