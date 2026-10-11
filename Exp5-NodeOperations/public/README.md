### index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Node File Server</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <h1>Node File Server</h1>
  <button id="statusButton">Check Server</button>
  <p id="status">Ready</p>
  <script src="script.js"></script>
</body>
</html>
```

### style.css
```css
body {
  font-family: Arial, sans-serif;
  background: #f4f4f4;
  color: #222;
  margin: 0;
  padding: 2rem;
}
h1 {
  color: #e65c00;
}
button {
  padding: 0.6rem 1rem;
  cursor: pointer;
}
```

### script.js
```javascript
const button = document.querySelector("#statusButton");
const status = document.querySelector("#status");

button.addEventListener("click", async () => {
  try {
    const response = await fetch("/");
    status.textContent = response.ok ? "Server is running" : "Server error";
  } catch (error) {
    status.textContent = "Could not connect to server";
    console.error(error);
  }
});
```

### Commands
```sh
node server.js
npm start
```

### server.js
```javascript
const express = require("express");
const app = express();
const PORT = 5000;
app.use(express.static("public"));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```
