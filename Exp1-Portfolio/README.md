# index.html
```html
<!DOCTYPE html>
<html>
<head>
  <title>Portfolio</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <nav class="sidebar">
    <button data-target="profile" class="active">Profile</button>
    <button data-target="projects">Projects</button>
  </nav>
  <main>
    <section id="profile" class="view active"><h1>Jaiwant Karrun</h1></section>
    <section id="projects" class="view"><h1>Projects</h1></section>
  </main>
  <script src="script.js"></script>
</body>
</html>
```

# style.css
```css
body {
  margin: 0;
  display: flex;
  font-family: sans-serif;
  background: #090d16;
  color: #ffffff;
}
.sidebar {
  width: 220px;
  height: 100vh;
  padding: 20px;
}
button {
  display: block;
  width: 100%;
  margin-bottom: 10px;
}
.view { display: none; }
.view.active { display: block; }
button.active { color: #10b981; }
```

# script.js
```javascript
const buttons = document.querySelectorAll('.sidebar button');
const views = document.querySelectorAll('.view');

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    buttons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const target = btn.dataset.target;
    views.forEach(v => {
      if (v.id === target) {
        v.classList.add('active');
      } else {
        v.classList.remove('active');
      }
    });
  });
});
```
