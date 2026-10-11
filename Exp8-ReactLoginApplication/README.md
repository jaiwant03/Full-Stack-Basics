# Client

## client/src/App.jsx
```jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
```

## client/src/main.jsx
```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log("React app started");
```

# Server

## server/server.js
```js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

```

## server/routes/authRoutes.js
```js
const express = require("express");
const router = express.Router();
const { login, register } = require("../controllers/authController");

router.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

router.post("/register", register);
router.post("/login", login);

router.use((err, req, res, next) => {
  res.status(500).json({ message: "Server error" });
});
module.exports = router;
```

# Commands
```bash
cd client
npm install
npm run dev
cd ../server
npm install
npm start
```