# HTML
```html
<div class="card">
  <h1>Student Portal</h1>
  <label for="name">Name</label>
  <form>
    <input id="name" type="text" placeholder="Enter your name">
    <button id="btn" type="button">Submit</button>
  </form>
  <p id="output">Ready</p>
  <small>Exam Practice</small>
</div>
<script src="app.js"></script>
```

# CSS
```css
body {
  font-family: Arial, sans-serif;
  background: #f4f4f4;
  display: grid;
  place-items: center;
  height: 100vh;
  margin: 0;
}
.card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}
```

# JS
```js
const btn = document.getElementById('btn');
const nameInput = document.getElementById('name');
const output = document.getElementById('output');

btn.addEventListener('click', () => {
  const name = nameInput.value.trim();
  if (!name) {
    output.textContent = 'Please enter your name';
    return;
  }
  output.textContent = 'Hello, ' + name + '!';
});
```

# server.js
```js
const http=require('http');
const fs=require('fs');
http.createServer((req,res)=>{fs.readFile('public/index.html',(e,d)=>res.end(d));}).listen(3000);
console.log('Server running on port 3000');
```

# Commands
```bash
npm install
node server.js
http://localhost:3000
```
