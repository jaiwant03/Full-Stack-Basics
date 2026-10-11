### index.html

```html
<!DOCTYPE html>
<html>
<head><link rel="stylesheet" href="style.css"></head>
<body>
  <h2>Job Application Form</h2>
  <form id="jobForm">
    <input type="text" id="name" placeholder="Full Name" required>
    <input type="email" id="email" placeholder="Email" required>
    <input type="tel" id="phone" placeholder="10-digit Phone" required>
    <select id="qualification" required>
      <option value="">Select Qualification</option>
      <option value="Degree">Bachelor Degree</option>
    </select>
    <input type="file" id="resume" required>
    <button type="submit">Submit Application</button>
  </form>
  <script src="script.js"></script>
</body>
</html>
```

### style.css

```css
body {
  font-family: Arial, sans-serif;
  background: #ffffff;
  padding: 20px;
}
form {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #2e7d32;
}
input, select, button {
  width: 100%;
  padding: 8px;
  margin: 6px 0;
}
button {
  background: #2e7d32;
  color: white;
}
```

### script.js

```javascript
document.getElementById("jobForm").addEventListener("submit", function (e) {
  e.preventDefault();
  let name = document.getElementById("name").value.trim();
  let email = document.getElementById("email").value.trim();
  let phone = document.getElementById("phone").value.trim();
  if (name.length < 3) {
    alert("Name must contain at least 3 characters");
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert("Please enter a valid email");
    return;
  }
  if (!/^[0-9]{10}$/.test(phone)) {
    alert("Please enter a valid 10-digit phone number");
    return;
  }
  alert("Your response has been submitted");
  this.reset();
});
```
