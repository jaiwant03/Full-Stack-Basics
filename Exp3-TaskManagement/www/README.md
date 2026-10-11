```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Task Manager</title>
</head>
<body>
<main class="todo-app">
<h1>Task Manager</h1>
<form id="task-form">
<input id="task-input" type="text" placeholder="Add a task">
<button type="submit">Add</button>
</form>
<ul id="task-list"></ul>
</main>
</body>
</html>
```

```css
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #f4f4f4;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
.todo-app {
  width: 320px;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}
```

```javascript
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const list = document.getElementById("task-list");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const task = input.value.trim();
  if (!task) return;
  const item = document.createElement("li");
  item.textContent = task;
  list.appendChild(item);
  input.value = "";
});
```

```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add android
npx cap sync android
npx cap open android
```
