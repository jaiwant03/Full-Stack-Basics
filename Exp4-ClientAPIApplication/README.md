### index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WeatherNow</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <main class="weather-app">
    <h1>WeatherNow</h1>
    <form id="searchForm">
      <input id="cityInput" type="text" placeholder="Enter a city" required>
      <button type="submit">Search</button>
    </form>
    <p id="weatherResult" aria-live="polite"></p>
  </main>
  <script src="script.js"></script>
</body>
</html>
```

### style.css

```css
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  font-family: Arial, sans-serif;
  background: #e8f4fc;
  color: #172554;
}
.weather-app {
  width: min(90%, 420px);
  padding: 2rem;
  border-radius: 18px;
  background: #fff;
  text-align: center;
}
```

### script.js

```javascript
const API_KEY = "YOUR_API_KEY";
const form = document.querySelector("#searchForm");
const cityInput = document.querySelector("#cityInput");
const result = document.querySelector("#weatherResult");
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return;
  result.textContent = "Loading...";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("City not found");
    const weather = await response.json();
    result.textContent = `${weather.name}: ${Math.round(weather.main.temp)}°C`;
  } catch (error) {
    result.textContent = error.message;
  }
});
```
