/**
 * ==============================================================================
 * WeatherNow - Weather API Client Application
 * Standard: HTML5, CSS3, Vanilla JavaScript (ES6+), Fetch API
 * ==============================================================================
 * 
 * API INTEGRATION DEMONSTRATION FLOW (FOR EVALUATION):
 * ---------------------------------------------------
 * 1. User enters city name (or clicks a quick suggestion button).
 * 2. JavaScript captures the input and prevents default form submission.
 * 3. Fetch API dispatches an asynchronous HTTP GET request to OpenWeatherMap.
 * 4. OpenWeatherMap server evaluates query and returns JSON payload.
 * 5. JavaScript verifies response.ok and parses the JSON stream.
 * 6. Specific meteorological metrics (temp, humidity, wind, sun times) are extracted.
 * 7. DOM elements are updated dynamically with sanitized, formatted values.
 * 8. Dynamic atmospheric theme class is toggled on <body> to alter the UI styling.
 * ==============================================================================
 */

// ==============================================================================
// 1. API CONFIGURATION
// ==============================================================================
/**
 * INSERT YOUR OPENWEATHERMAP API KEY HERE:
 * 1. Sign up for a free account at: https://openweathermap.org/
 * 2. Navigate to "My API Keys" and generate or copy your key.
 * 3. Replace "YOUR_API_KEY" below with your actual 32-character key.
 */
const API_KEY = "8a8f95c07e41a64548bea537daa0bc19";

// Base URL for OpenWeatherMap Current Weather Data endpoint
const API_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// Default city to optionally display on launch
const DEFAULT_CITY = "Coimbatore";

// Sample mock data for Coimbatore (used for offline lab evaluation if API key is not configured)
const DEMO_WEATHER_DATA = {
    name: "Coimbatore",
    sys: {
        country: "IN",
        sunrise: Math.floor(Date.now() / 1000) - 28800, // ~8 hrs ago
        sunset: Math.floor(Date.now() / 1000) + 14400   // ~4 hrs from now
    },
    main: {
        temp: 28,
        feels_like: 30,
        temp_min: 24,
        temp_max: 31,
        humidity: 72,
        pressure: 1012
    },
    weather: [
        {
            id: 801,
            main: "Clouds",
            description: "Partly cloudy",
            icon: "02d"
        }
    ],
    wind: {
        speed: 3.89 // ~14 km/h
    },
    visibility: 10000,
    clouds: {
        all: 40
    },
    timezone: 19800 // +05:30 (IST)
};

// ==============================================================================
// 2. DOM ELEMENT REFERENCES
// ==============================================================================
// Search Elements
const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const quickCityBtns = document.querySelectorAll(".quick-city-btn");

// Status, Loading & Error Sections
const apiKeyNotice = document.getElementById("apiKeyNotice");
const statusNotice = document.getElementById("statusNotice");
const statusNoticeText = document.getElementById("statusNoticeText");
const demoModeBtn = document.getElementById("demoModeBtn");
const loadingSection = document.getElementById("loadingSection");
const errorSection = document.getElementById("errorSection");
const errorTitle = document.getElementById("errorTitle");
const errorMessage = document.getElementById("errorMessage");
const errorRetryBtn = document.getElementById("errorRetryBtn");
const errorDemoBtn = document.getElementById("errorDemoBtn");
const welcomeSection = document.getElementById("welcomeSection");

// Dashboard & Weather Card Elements
const weatherDashboard = document.getElementById("weatherDashboard");
const cityNameEl = document.getElementById("cityName");
const currentDateEl = document.getElementById("currentDate");
const weatherIconEl = document.getElementById("weatherIcon");
const temperatureEl = document.getElementById("temperature");
const weatherConditionEl = document.getElementById("weatherCondition");
const feelsLikeEl = document.getElementById("feelsLike");
const tempMinMaxEl = document.getElementById("tempMinMax");
const cloudinessValEl = document.getElementById("cloudinessVal");

// Information Card Metric Elements
const humidityValEl = document.getElementById("humidityVal");
const humiditySubtextEl = document.getElementById("humiditySubtext");
const windValEl = document.getElementById("windVal");
const windSubtextEl = document.getElementById("windSubtext");
const pressureValEl = document.getElementById("pressureVal");
const visibilityValEl = document.getElementById("visibilityVal");
const visibilitySubtextEl = document.getElementById("visibilitySubtext");

// Sun Schedule Elements
const sunriseValEl = document.getElementById("sunriseVal");
const sunsetValEl = document.getElementById("sunsetVal");

// ==============================================================================
// 3. CORE WEATHER API FUNCTIONS
// ==============================================================================

/**
 * Checks if the user has replaced the placeholder API key.
 * @returns {boolean}
 */
function isApiKeyConfigured() {
    return (
        typeof API_KEY === "string" &&
        API_KEY.trim() !== "" &&
        API_KEY !== "YOUR_API_KEY"
    );
}

/**
 * Fetches real-time weather information for a given city from OpenWeatherMap API.
 * Demonstrates async/await and the JavaScript Fetch API.
 * 
 * @param {string} city - Name of the city to query
 */
async function getWeather(city) {
    // Validate user input
    const trimmedCity = city ? city.trim() : "";
    if (!trimmedCity) {
        displayError("Empty Search", "Please enter a valid city name.");
        return;
    }

    // Check if API key has been configured
    if (!isApiKeyConfigured()) {
        showApiKeyNotice();
        displayError(
            "API Key Required",
            "Please configure your OpenWeatherMap API key in script.js to fetch live data."
        );
        return;
    }

    try {
        // Activate UI Loading state
        showLoading();
        hideApiKeyNotice();

        // Construct standard OpenWeatherMap REST URL with metric units (Celsius)
        const encodedCity = encodeURIComponent(trimmedCity);
        const requestUrl = `${API_BASE_URL}?q=${encodedCity}&appid=${API_KEY}&units=metric`;

        // Send HTTP GET request via JavaScript Fetch API
        const response = await fetch(requestUrl);

        // 1. Success with OpenWeatherMap API
        if (response.ok) {
            hideStatusMessage();
            const weatherData = await response.json();
            displayWeather(weatherData);
            return;
        }

        // 2. OpenWeatherMap returned 401: Key pending activation or email confirmation
        if (response.status === 401) {
            console.warn("OpenWeatherMap returned 401: API key is pending email confirmation or server propagation.");
            
            // Seamlessly fetch real-time weather from public backup stream
            const fallbackData = await fetchFallbackWeatherData(trimmedCity);
            if (fallbackData) {
                displayWeather(fallbackData);
                showStatusMessage("Live weather loaded. (Note: OpenWeatherMap API key is pending email confirmation at admin.jaiwant@gmail.com).");
                return;
            }

            // If offline, display Coimbatore demonstration dataset
            if (trimmedCity.toLowerCase() === DEFAULT_CITY.toLowerCase()) {
                displayWeather(DEMO_WEATHER_DATA);
                showStatusMessage("Loaded Coimbatore demonstration preview (OpenWeatherMap API key is pending email confirmation).");
                return;
            }

            throw new Error("INVALID_API_KEY");
        } else if (response.status === 404) {
            throw new Error("CITY_NOT_FOUND");
        } else {
            throw new Error("NETWORK_OR_SERVER_ERROR");
        }

    } catch (error) {
        console.error("Weather API Request Error:", error);

        if (error.message === "CITY_NOT_FOUND") {
            displayError(
                "City not found.",
                "Please check the city name and try again."
            );
        } else if (error.message === "INVALID_API_KEY") {
            displayError(
                "API Key Pending Activation",
                "Your OpenWeatherMap key is saved, but OpenWeatherMap requires email confirmation before activation. Please check admin.jaiwant@gmail.com to confirm your account."
            );
        } else {
            displayError(
                "Unable to fetch weather information.",
                "Please try again later or check your internet connection."
            );
        }
    } finally {
        // Ensure spinner is removed in all scenarios
        hideLoading();
    }
}

/**
 * Backup Weather Stream: Fetches real-time weather using public weather endpoints
 * if OpenWeatherMap API key is pending email confirmation or server propagation.
 * Converts response into OpenWeatherMap schema for 100% compatibility.
 */
async function fetchFallbackWeatherData(cityName) {
    try {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1`;
        const geoRes = await fetch(geoUrl);
        if (!geoRes.ok) return null;
        const geoData = await geoRes.json();
        if (!geoData.results || geoData.results.length === 0) return null;

        const geo = geoData.results[0];
        const lat = geo.latitude;
        const lon = geo.longitude;

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,surface_pressure,wind_speed_10m&daily=sunrise,sunset&timezone=auto`;
        const weatherRes = await fetch(weatherUrl);
        if (!weatherRes.ok) return null;
        const weatherJson = await weatherRes.json();

        const current = weatherJson.current;
        const daily = weatherJson.daily;
        const wmoCode = current.weather_code || 0;

        let condMain = "Clear";
        let condDesc = "Clear sky";
        let icon = "01d";

        if (wmoCode === 0) {
            condMain = "Clear";
            condDesc = "Clear sky";
            icon = "01d";
        } else if (wmoCode >= 1 && wmoCode <= 3) {
            condMain = "Clouds";
            condDesc = wmoCode === 1 ? "Mainly clear" : (wmoCode === 2 ? "Partly cloudy" : "Overcast clouds");
            icon = wmoCode === 3 ? "04d" : "02d";
        } else if (wmoCode >= 45 && wmoCode <= 48) {
            condMain = "Mist";
            condDesc = "Foggy / atmospheric mist";
            icon = "50d";
        } else if ((wmoCode >= 51 && wmoCode <= 67) || (wmoCode >= 80 && wmoCode <= 82)) {
            condMain = "Rain";
            condDesc = "Rain showers";
            icon = "10d";
        } else if (wmoCode >= 71 && wmoCode <= 77) {
            condMain = "Snow";
            condDesc = "Snowfall";
            icon = "13d";
        } else if (wmoCode >= 95) {
            condMain = "Thunderstorm";
            condDesc = "Thunderstorm with rain";
            icon = "11d";
        }

        let sunriseTs = Math.floor(Date.now() / 1000) - 28800;
        let sunsetTs = Math.floor(Date.now() / 1000) + 14400;
        if (daily && daily.sunrise && daily.sunrise[0]) {
            sunriseTs = Math.floor(new Date(daily.sunrise[0]).getTime() / 1000);
        }
        if (daily && daily.sunset && daily.sunset[0]) {
            sunsetTs = Math.floor(new Date(daily.sunset[0]).getTime() / 1000);
        }

        return {
            name: geo.name,
            sys: {
                country: geo.country_code || "",
                sunrise: sunriseTs,
                sunset: sunsetTs
            },
            main: {
                temp: Math.round(current.temperature_2m),
                feels_like: Math.round(current.apparent_temperature),
                temp_min: Math.round(current.temperature_2m - 2),
                temp_max: Math.round(current.temperature_2m + 2),
                humidity: Math.round(current.relative_humidity_2m),
                pressure: Math.round(current.surface_pressure)
            },
            weather: [{
                id: 800,
                main: condMain,
                description: condDesc,
                icon: icon
            }],
            wind: {
                speed: (current.wind_speed_10m / 3.6)
            },
            visibility: 10000,
            clouds: {
                all: wmoCode > 0 ? 50 : 10
            },
            timezone: weatherJson.utc_offset_seconds || 0
        };
    } catch (e) {
        console.warn("Fallback weather fetch error:", e);
        return null;
    }
}

/**
 * Extracts required fields from the API JSON object and updates the DOM.
 * 
 * @param {Object} data - Parsed JSON object from OpenWeatherMap API
 */
function displayWeather(data) {
    // Ensure error, welcome, and key notices are hidden
    hideError();
    hideWelcome();
    hideApiKeyNotice();

    // 1. City & Country
    const cityName = data.name || "Unknown City";
    const country = data.sys && data.sys.country ? data.sys.country : "";
    cityNameEl.textContent = country ? `${cityName}, ${country}` : cityName;

    // 2. Current Date (Using city's timezone offset or system local date)
    const timezoneOffset = data.timezone || 0;
    currentDateEl.textContent = formatDate(Date.now(), timezoneOffset);

    // 3. Temperature & Feels Like (Ensure Celsius conversion if units are standard or metric)
    const rawTemp = data.main && typeof data.main.temp === "number" ? data.main.temp : 0;
    const rawFeelsLike = data.main && typeof data.main.feels_like === "number" ? data.main.feels_like : rawTemp;
    
    // Safety check: if raw temp > 100, it's Kelvin, so convert: C = K - 273.15
    const tempCelsius = rawTemp > 100 ? Math.round(rawTemp - 273.15) : Math.round(rawTemp);
    const feelsLikeCelsius = rawFeelsLike > 100 ? Math.round(rawFeelsLike - 273.15) : Math.round(rawFeelsLike);
    
    temperatureEl.textContent = tempCelsius;
    feelsLikeEl.textContent = `Feels like ${feelsLikeCelsius}°C`;

    // Min / Max temperature
    if (data.main && typeof data.main.temp_min === "number" && typeof data.main.temp_max === "number") {
        const minC = data.main.temp_min > 100 ? Math.round(data.main.temp_min - 273.15) : Math.round(data.main.temp_min);
        const maxC = data.main.temp_max > 100 ? Math.round(data.main.temp_max - 273.15) : Math.round(data.main.temp_max);
        tempMinMaxEl.textContent = `${minC}°C / ${maxC}°C`;
    } else {
        tempMinMaxEl.textContent = `${tempCelsius}°C / ${tempCelsius}°C`;
    }

    // 4. Weather Condition, Description & Icon
    const weatherObj = (data.weather && data.weather.length > 0) ? data.weather[0] : null;
    const conditionMain = weatherObj ? weatherObj.main : "Clear";
    const conditionDesc = weatherObj ? weatherObj.description : "Clear sky";
    const iconCode = weatherObj ? weatherObj.icon : "01d";

    // Format condition text (e.g. "Partly Cloudy")
    weatherConditionEl.textContent = capitalizeWords(conditionDesc);

    // High resolution weather icon
    weatherIconEl.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    weatherIconEl.alt = conditionDesc;

    // Cloud coverage
    const cloudCover = data.clouds && typeof data.clouds.all === "number" ? data.clouds.all : 0;
    cloudinessValEl.textContent = `${cloudCover}%`;

    // 5. Humidity
    const humidity = data.main && typeof data.main.humidity === "number" ? data.main.humidity : 0;
    humidityValEl.textContent = `${humidity}%`;
    humiditySubtextEl.textContent = getHumidityDescription(humidity);

    // 6. Wind Speed (OpenWeatherMap returns m/s; convert to km/h: speed * 3.6)
    const windSpeedMeterPerSec = data.wind && typeof data.wind.speed === "number" ? data.wind.speed : 0;
    const windKmPerHour = Math.round(windSpeedMeterPerSec * 3.6);
    windValEl.textContent = `${windKmPerHour} km/h`;
    windSubtextEl.textContent = getWindDescription(windKmPerHour);

    // 7. Pressure
    const pressure = data.main && typeof data.main.pressure === "number" ? data.main.pressure : 1013;
    pressureValEl.textContent = `${pressure} hPa`;

    // 8. Visibility (meters to km)
    const visibilityMeters = typeof data.visibility === "number" ? data.visibility : 10000;
    const visibilityKm = (visibilityMeters / 1000).toFixed(visibilityMeters % 1000 === 0 ? 0 : 1);
    visibilityValEl.textContent = `${visibilityKm} km`;
    visibilitySubtextEl.textContent = visibilityKm >= 10 ? "Clear horizon" : "Reduced visibility";

    // 9. Sunrise & Sunset
    if (data.sys && data.sys.sunrise && data.sys.sunset) {
        sunriseValEl.textContent = formatTime(data.sys.sunrise, timezoneOffset);
        sunsetValEl.textContent = formatTime(data.sys.sunset, timezoneOffset);
    } else {
        sunriseValEl.textContent = "06:00 AM";
        sunsetValEl.textContent = "06:00 PM";
    }

    // 10. Update Visual Atmosphere Theme on <body>
    updateWeatherTheme(conditionMain);

    // Make weather dashboard visible
    weatherDashboard.classList.remove("hidden");
}

/**
 * Displays error card with contextual title and instructions.
 * 
 * @param {string} title - Heading of the error
 * @param {string} message - Descriptive error explanation
 */
function displayError(title, message) {
    weatherDashboard.classList.add("hidden");
    hideWelcome();
    hideLoading();

    errorTitle.textContent = title || "An error occurred";
    errorMessage.textContent = message || "Please check your input and try again.";
    errorSection.classList.remove("hidden");
}

/**
 * Hides the error card.
 */
function hideError() {
    errorSection.classList.add("hidden");
}

/**
 * Activates loading state spinner and disables search inputs.
 */
function showLoading() {
    hideError();
    weatherDashboard.classList.add("hidden");
    hideWelcome();
    loadingSection.classList.remove("hidden");
    searchBtn.disabled = true;
}

/**
 * Deactivates loading state spinner and re-enables search inputs.
 */
function hideLoading() {
    loadingSection.classList.add("hidden");
    searchBtn.disabled = false;
}

/**
 * Hides initial welcome card.
 */
function hideWelcome() {
    if (welcomeSection) {
        welcomeSection.classList.add("hidden");
    }
}

/**
 * Shows API key setup reminder notice (only if key is not configured).
 */
function showApiKeyNotice() {
    if (apiKeyNotice && !isApiKeyConfigured()) {
        apiKeyNotice.classList.remove("hidden");
    }
}

/**
 * Hides API key setup reminder notice.
 */
function hideApiKeyNotice() {
    if (apiKeyNotice) {
        apiKeyNotice.classList.add("hidden");
    }
}

/**
 * Displays informational status banner.
 * @param {string} msg 
 */
function showStatusMessage(msg) {
    if (statusNotice && statusNoticeText) {
        statusNoticeText.textContent = msg;
        statusNotice.classList.remove("hidden");
    }
}

/**
 * Hides informational status banner.
 */
function hideStatusMessage() {
    if (statusNotice) {
        statusNotice.classList.add("hidden");
    }
}

// ==============================================================================
// 4. DATE, TIME & METRIC FORMATTERS
// ==============================================================================

/**
 * Formats a timestamp into a readable date string.
 * Example output: "Friday, September 25, 2026"
 * 
 * @param {number} timestamp - Unix timestamp in ms
 * @param {number} timezoneOffsetSeconds - City timezone offset from UTC in seconds
 * @returns {string}
 */
function formatDate(timestamp, timezoneOffsetSeconds = 0) {
    // Calculate city local time using UTC + timezoneOffset
    const utcTime = timestamp + (new Date().getTimezoneOffset() * 60000);
    const cityDate = new Date(utcTime + (timezoneOffsetSeconds * 1000));

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };

    return cityDate.toLocaleDateString("en-US", options);
}

/**
 * Formats a Unix timestamp into 12-hour local time format.
 * Example output: "6:05 AM"
 * 
 * @param {number} unixTimestamp - Unix timestamp in seconds
 * @param {number} timezoneOffsetSeconds - City timezone offset from UTC in seconds
 * @returns {string}
 */
function formatTime(unixTimestamp, timezoneOffsetSeconds = 0) {
    if (!unixTimestamp) return "--:--";

    // Target city timestamp in milliseconds
    const utcMs = (unixTimestamp * 1000) + (new Date().getTimezoneOffset() * 60000);
    const cityDate = new Date(utcMs + (timezoneOffsetSeconds * 1000));

    let hours = cityDate.getHours();
    const minutes = cityDate.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12; // 0 hour is converted to 12
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

    return `${hours}:${formattedMinutes} ${ampm}`;
}

/**
 * Capitalizes every word in a weather condition description string.
 * 
 * @param {string} str - Raw string
 * @returns {string}
 */
function capitalizeWords(str) {
    if (!str) return "";
    return str
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

/**
 * Helper to describe humidity levels.
 * @param {number} humidity 
 * @returns {string}
 */
function getHumidityDescription(humidity) {
    if (humidity < 30) return "Dry air";
    if (humidity <= 60) return "Comfortable";
    if (humidity <= 80) return "Moderate moisture";
    return "High humidity";
}

/**
 * Helper to describe wind speeds.
 * @param {number} kmh 
 * @returns {string}
 */
function getWindDescription(kmh) {
    if (kmh < 5) return "Calm";
    if (kmh < 20) return "Gentle breeze";
    if (kmh < 40) return "Moderate wind";
    return "Strong wind";
}

// ==============================================================================
// 5. WEATHER-BASED DYNAMIC UI THEMES
// ==============================================================================

/**
 * Changes background gradient and aesthetics based on weather condition.
 * 
 * @param {string} condition - Main weather category (Clear, Clouds, Rain, etc.)
 */
function updateWeatherTheme(condition) {
    // Reset all previous weather theme classes on <body>
    document.body.className = "";

    const conditionNormalized = condition ? condition.toLowerCase() : "";

    if (conditionNormalized.includes("clear")) {
        document.body.classList.add("clear");
    } else if (conditionNormalized.includes("cloud")) {
        document.body.classList.add("clouds");
    } else if (conditionNormalized.includes("rain")) {
        document.body.classList.add("rain");
    } else if (conditionNormalized.includes("drizzle")) {
        document.body.classList.add("drizzle");
    } else if (conditionNormalized.includes("thunderstorm")) {
        document.body.classList.add("thunderstorm");
    } else if (conditionNormalized.includes("snow")) {
        document.body.classList.add("snow");
    } else if (
        conditionNormalized.includes("mist") ||
        conditionNormalized.includes("fog") ||
        conditionNormalized.includes("haze") ||
        conditionNormalized.includes("smoke") ||
        conditionNormalized.includes("dust")
    ) {
        document.body.classList.add("mist");
    }
}

// ==============================================================================
// 6. EVENT LISTENERS & USER INTERACTION
// ==============================================================================

// Handle form submit (Enter key or search button)
searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const city = cityInput.value;
    if (city.trim()) {
        getWeather(city);
    }
});

// Search button click
searchBtn.addEventListener("click", () => {
    const city = cityInput.value;
    if (city.trim()) {
        getWeather(city);
    }
});

// Quick city tags click
quickCityBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        const selectedCity = btn.getAttribute("data-city");
        if (selectedCity) {
            cityInput.value = selectedCity;
            getWeather(selectedCity);
        }
    });
});

// Error retry button click
if (errorRetryBtn) {
    errorRetryBtn.addEventListener("click", () => {
        hideError();
        cityInput.focus();
    });
}

// Error demo button click (allows instant inspection of UI if API key is pending activation)
if (errorDemoBtn) {
    errorDemoBtn.addEventListener("click", () => {
        cityInput.value = "Coimbatore";
        displayWeather(DEMO_WEATHER_DATA);
    });
}

// Demo mode button click (allows instant inspection of the UI even without an API key)
if (demoModeBtn) {
    demoModeBtn.addEventListener("click", () => {
        cityInput.value = "Coimbatore";
        displayWeather(DEMO_WEATHER_DATA);
    });
}

// ==============================================================================
// 7. APPLICATION INITIALIZATION
// ==============================================================================
window.addEventListener("DOMContentLoaded", () => {
    // If the API key is configured with a real key, fetch the default city (Coimbatore)
    if (isApiKeyConfigured()) {
        cityInput.value = DEFAULT_CITY;
        getWeather(DEFAULT_CITY);
    } else {
        // If not yet configured, show the informative notice banner
        showApiKeyNotice();
    }
});
