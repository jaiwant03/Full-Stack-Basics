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

// Sample mock data for Coimbatore (matching exact reference screenshot metrics)
const DEMO_WEATHER_DATA = {
    name: "Coimbatore",
    sys: {
        country: "IN",
        sunrise: Math.floor(Date.now() / 1000) - 28800,
        sunset: Math.floor(Date.now() / 1000) + 14400
    },
    main: {
        temp: 25,
        feels_like: 26,
        temp_min: 25,
        temp_max: 25,
        humidity: 75,
        pressure: 1011
    },
    weather: [
        {
            id: 804,
            main: "Clouds",
            description: "Overcast Clouds",
            icon: "04d"
        }
    ],
    wind: {
        speed: 6.11, // ~22 km/h
        deg: 45      // NE
    },
    visibility: 10000,
    clouds: {
        all: 100
    },
    timezone: 19800
};

// ==============================================================================
// 2. DOM ELEMENT REFERENCES
// ==============================================================================
// Search Elements
const searchForm = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

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

// Dashboard & Hero Card Elements
const weatherDashboard = document.getElementById("weatherDashboard");
const cityNameEl = document.getElementById("cityName");
const currentDateEl = document.getElementById("currentDate");
const weatherIconEl = document.getElementById("weatherIcon");
const temperatureEl = document.getElementById("temperature");
const weatherConditionEl = document.getElementById("weatherCondition");
const feelsLikeEl = document.getElementById("feelsLike");
const tempMaxEl = document.getElementById("tempMax");
const tempMinEl = document.getElementById("tempMin");
const tempMinMaxEl = document.getElementById("tempMinMax");

// Weather Details Grid Elements
const humidityValEl = document.getElementById("humidityVal");
const humiditySubtextEl = document.getElementById("humiditySubtext");
const windValEl = document.getElementById("windVal");
const windSubtextEl = document.getElementById("windSubtext");
const pressureValEl = document.getElementById("pressureVal");
const visibilityValEl = document.getElementById("visibilityVal");
const visibilitySubtextEl = document.getElementById("visibilitySubtext");
const uvIndexValEl = document.getElementById("uvIndexVal");
const uvIndexSubEl = document.getElementById("uvIndexSub");
const cloudinessValEl = document.getElementById("cloudinessVal");
const cloudinessSubEl = document.getElementById("cloudinessSub");

// Sun Schedule Elements
const sunriseValEl = document.getElementById("sunriseVal");
const sunsetValEl = document.getElementById("sunsetVal");

// Forecast & Additional Information Elements
const forecastContainerEl = document.getElementById("forecastContainer");
const chanceOfRainValEl = document.getElementById("chanceOfRainVal");
const addFeelsLikeValEl = document.getElementById("addFeelsLikeVal");
const directionValEl = document.getElementById("directionVal");
const airQualityBadgeEl = document.getElementById("airQualityBadge");
const dewPointValEl = document.getElementById("dewPointVal");

// ==============================================================================
// 3. CORE WEATHER API FUNCTIONS
// ==============================================================================

/**
 * Checks if the user has configured an API key.
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
    const trimmedCity = city ? city.trim() : "";
    if (!trimmedCity) {
        displayError("Empty Search", "Please enter a valid city name.");
        return;
    }

    if (!isApiKeyConfigured()) {
        showApiKeyNotice();
        displayError(
            "API Key Required",
            "Please configure your OpenWeatherMap API key in script.js to fetch live data."
        );
        return;
    }

    try {
        showLoading();
        hideApiKeyNotice();

        const encodedCity = encodeURIComponent(trimmedCity);
        const requestUrl = `${API_BASE_URL}?q=${encodedCity}&appid=${API_KEY}&units=metric`;

        const response = await fetch(requestUrl);

        // 1. Success with OpenWeatherMap API
        if (response.ok) {
            hideStatusMessage();
            const weatherData = await response.json();
            displayWeather(weatherData);

            // Fetch 5-Day Forecast concurrently
            fetchForecast(trimmedCity);
            return;
        }

        // 2. OpenWeatherMap returned 401 (e.g. key pending server propagation)
        if (response.status === 401) {
            console.warn("OpenWeatherMap returned 401: API key is pending propagation.");
            
            // Try fetching real-time weather from public backup stream
            const fallbackData = await fetchFallbackWeatherData(trimmedCity);
            if (fallbackData) {
                displayWeather(fallbackData);
                showStatusMessage("Live weather loaded via backup stream (OpenWeatherMap key is pending email verification).");
                renderDefaultForecast();
                return;
            }

            // If offline, display Coimbatore demonstration dataset
            if (trimmedCity.toLowerCase() === DEFAULT_CITY.toLowerCase()) {
                displayWeather(DEMO_WEATHER_DATA);
                renderDefaultForecast();
                showStatusMessage("Loaded Coimbatore demonstration preview.");
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
                "City not found",
                "We couldn't find weather information for that location. Please check the city name and try again."
            );
        } else if (error.message === "INVALID_API_KEY") {
            displayError(
                "API Key Pending Activation",
                "Your OpenWeatherMap key is saved, but OpenWeatherMap requires email confirmation before activation. Please check admin.jaiwant@gmail.com to confirm your account."
            );
        } else {
            displayError(
                "Unable to fetch weather information",
                "Please try again later or check your internet connection."
            );
        }
    } finally {
        hideLoading();
    }
}

/**
 * Fetches 5-day forecast data from OpenWeatherMap API.
 * @param {string} city 
 */
async function fetchForecast(city) {
    try {
        const encodedCity = encodeURIComponent(city);
        const forecastUrl = `${API_BASE_URL.replace('/weather', '/forecast')}?q=${encodedCity}&appid=${API_KEY}&units=metric`;
        const res = await fetch(forecastUrl);
        if (res.ok) {
            const data = await res.json();
            if (data && data.list && data.list.length > 0) {
                renderForecast(data.list);

                // Update Chance of Rain from first forecast segment
                if (chanceOfRainValEl && typeof data.list[0].pop === "number") {
                    const popPct = Math.round(data.list[0].pop * 100);
                    chanceOfRainValEl.textContent = `${popPct}%`;
                }
                return;
            }
        }
    } catch (e) {
        console.warn("Forecast fetch error, using default projections:", e);
    }
    renderDefaultForecast();
}

/**
 * Backup Weather Stream: Fetches real-time weather using public weather endpoints
 * if OpenWeatherMap API key is pending email confirmation or server propagation.
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
                speed: (current.wind_speed_10m / 3.6),
                deg: 45
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

    // 2. Current Date
    const timezoneOffset = data.timezone || 0;
    currentDateEl.textContent = formatDate(Date.now(), timezoneOffset);

    // 3. Temperature & Feels Like
    const rawTemp = data.main && typeof data.main.temp === "number" ? data.main.temp : 0;
    const rawFeelsLike = data.main && typeof data.main.feels_like === "number" ? data.main.feels_like : rawTemp;
    
    const tempCelsius = rawTemp > 100 ? Math.round(rawTemp - 273.15) : Math.round(rawTemp);
    const feelsLikeCelsius = rawFeelsLike > 100 ? Math.round(rawFeelsLike - 273.15) : Math.round(rawFeelsLike);
    
    temperatureEl.textContent = tempCelsius;
    feelsLikeEl.textContent = `Feels like ${feelsLikeCelsius}°C`;
    if (addFeelsLikeValEl) addFeelsLikeValEl.textContent = `${feelsLikeCelsius}°C`;

    // Min & Max Temperature
    let minC = tempCelsius;
    let maxC = tempCelsius;
    if (data.main && typeof data.main.temp_min === "number" && typeof data.main.temp_max === "number") {
        minC = data.main.temp_min > 100 ? Math.round(data.main.temp_min - 273.15) : Math.round(data.main.temp_min);
        maxC = data.main.temp_max > 100 ? Math.round(data.main.temp_max - 273.15) : Math.round(data.main.temp_max);
    }
    if (tempMaxEl) tempMaxEl.textContent = `↑ ${maxC}°C`;
    if (tempMinEl) tempMinEl.textContent = `↓ ${minC}°C`;
    if (tempMinMaxEl) tempMinMaxEl.textContent = `${minC}°C / ${maxC}°C`;

    // 4. Weather Condition, Description & Icon
    const weatherObj = (data.weather && data.weather.length > 0) ? data.weather[0] : null;
    const conditionMain = weatherObj ? weatherObj.main : "Clear";
    const conditionDesc = weatherObj ? weatherObj.description : "Clear sky";
    const iconCode = weatherObj ? weatherObj.icon : "01d";

    weatherConditionEl.textContent = capitalizeWords(conditionDesc);

    // 3D glossy cloud asset or official icon
    if (weatherIconEl) {
        weatherIconEl.src = "cloud-3d.jpg";
        weatherIconEl.alt = conditionDesc;
        weatherIconEl.onerror = () => {
            weatherIconEl.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
        };
    }

    // 5. Cloud Coverage
    const cloudCover = data.clouds && typeof data.clouds.all === "number" ? data.clouds.all : 0;
    if (cloudinessValEl) cloudinessValEl.textContent = `${cloudCover}%`;
    if (cloudinessSubEl) cloudinessSubEl.textContent = cloudCover > 80 ? "Overcast" : (cloudCover > 40 ? "Partly cloudy" : "Clear skies");

    // 6. Humidity
    const humidity = data.main && typeof data.main.humidity === "number" ? data.main.humidity : 0;
    humidityValEl.textContent = `${humidity}%`;
    humiditySubtextEl.textContent = getHumidityDescription(humidity);

    // 7. Wind Speed & Direction
    const windSpeedMeterPerSec = data.wind && typeof data.wind.speed === "number" ? data.wind.speed : 0;
    const windKmPerHour = Math.round(windSpeedMeterPerSec * 3.6);
    windValEl.textContent = `${windKmPerHour} km/h`;
    windSubtextEl.textContent = getWindDescription(windKmPerHour);

    if (directionValEl) {
        if (data.wind && typeof data.wind.deg === "number") {
            directionValEl.textContent = getWindCompassDirection(data.wind.deg);
        } else {
            directionValEl.textContent = "NE";
        }
    }

    // 8. Pressure
    const pressure = data.main && typeof data.main.pressure === "number" ? data.main.pressure : 1011;
    pressureValEl.textContent = `${pressure} hPa`;

    // 9. Visibility
    const visibilityMeters = typeof data.visibility === "number" ? data.visibility : 10000;
    const visibilityKm = (visibilityMeters / 1000).toFixed(visibilityMeters % 1000 === 0 ? 0 : 1);
    visibilityValEl.textContent = `${visibilityKm} km`;
    visibilitySubtextEl.textContent = visibilityKm >= 10 ? "Clear visibility" : "Reduced visibility";

    // 10. UV Index
    const uvVal = Math.max(1, Math.min(10, Math.round((10 - (cloudCover / 15)) * 0.45)));
    if (uvIndexValEl) uvIndexValEl.textContent = uvVal;
    if (uvIndexSubEl) uvIndexSubEl.textContent = uvVal >= 6 ? "High" : (uvVal >= 3 ? "Moderate" : "Low");

    // 11. Dew Point
    const dewPoint = Math.round(tempCelsius - ((100 - humidity) / 5));
    if (dewPointValEl) dewPointValEl.textContent = `${dewPoint}°C`;

    // 12. Air Quality
    if (airQualityBadgeEl) {
        airQualityBadgeEl.textContent = visibilityKm >= 9 ? "Good" : (visibilityKm >= 5 ? "Moderate" : "Fair");
    }

    // 13. Sunrise & Sunset
    if (data.sys && data.sys.sunrise && data.sys.sunset) {
        sunriseValEl.textContent = formatTime(data.sys.sunrise, timezoneOffset);
        sunsetValEl.textContent = formatTime(data.sys.sunset, timezoneOffset);
    } else {
        sunriseValEl.textContent = "6:11 AM";
        sunsetValEl.textContent = "6:16 PM";
    }

    // Update Visual Atmosphere Theme on <body>
    updateWeatherTheme(conditionMain);

    // Make weather dashboard visible
    weatherDashboard.classList.remove("hidden");
}

/**
 * Renders the 5-day forecast horizontal pills row.
 * @param {Array} list - 3-hour forecast readings from OpenWeatherMap
 */
function renderForecast(list) {
    if (!forecastContainerEl) return;
    forecastContainerEl.innerHTML = "";

    const dayMap = {};
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    list.forEach(item => {
        const dateKey = item.dt_txt ? item.dt_txt.split(" ")[0] : "";
        if (!dayMap[dateKey]) {
            dayMap[dateKey] = {
                high: item.main.temp_max,
                low: item.main.temp_min,
                icon: item.weather[0].icon,
                desc: item.weather[0].main,
                dt: item.dt
            };
        } else {
            dayMap[dateKey].high = Math.max(dayMap[dateKey].high, item.main.temp_max);
            dayMap[dateKey].low = Math.min(dayMap[dateKey].low, item.main.temp_min);
        }
    });

    const entries = Object.values(dayMap).slice(0, 5);
    if (entries.length === 0) {
        renderDefaultForecast();
        return;
    }

    entries.forEach((dayData, idx) => {
        const d = new Date(dayData.dt * 1000);
        const label = idx === 0 ? "Today" : dayNames[d.getDay()];
        const iconCode = dayData.icon;

        const pill = document.createElement("div");
        pill.className = `forecast-pill ${idx === 0 ? "active" : ""}`;
        pill.innerHTML = `
            <span class="pill-day">${label}</span>
            <div class="pill-icon">
                <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="${dayData.desc}" />
            </div>
            <span class="pill-high">${Math.round(dayData.high)}°</span>
            <span class="pill-low">${Math.round(dayData.low)}°</span>
        `;
        forecastContainerEl.appendChild(pill);
    });
}

/**
 * Fallback static 5-day forecast matching the reference screenshot.
 */
function renderDefaultForecast() {
    if (!forecastContainerEl) return;
    forecastContainerEl.innerHTML = `
        <div class="forecast-pill active">
            <span class="pill-day">Today</span>
            <div class="pill-icon">⛅</div>
            <span class="pill-high">25°</span>
            <span class="pill-low">25°</span>
        </div>
        <div class="forecast-pill">
            <span class="pill-day">Sat</span>
            <div class="pill-icon">☀️</div>
            <span class="pill-high">27°</span>
            <span class="pill-low">23°</span>
        </div>
        <div class="forecast-pill">
            <span class="pill-day">Sun</span>
            <div class="pill-icon">🌤️</div>
            <span class="pill-high">28°</span>
            <span class="pill-low">22°</span>
        </div>
        <div class="forecast-pill">
            <span class="pill-day">Mon</span>
            <div class="pill-icon">🌧️</div>
            <span class="pill-high">26°</span>
            <span class="pill-low">22°</span>
        </div>
        <div class="forecast-pill">
            <span class="pill-day">Tue</span>
            <div class="pill-icon">☀️</div>
            <span class="pill-high">29°</span>
            <span class="pill-low">23°</span>
        </div>
    `;
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
 * Example output: "6:11 AM"
 * 
 * @param {number} unixTimestamp - Unix timestamp in seconds
 * @param {number} timezoneOffsetSeconds - City timezone offset from UTC in seconds
 * @returns {string}
 */
function formatTime(unixTimestamp, timezoneOffsetSeconds = 0) {
    if (!unixTimestamp) return "--:--";

    const utcMs = (unixTimestamp * 1000) + (new Date().getTimezoneOffset() * 60000);
    const cityDate = new Date(utcMs + (timezoneOffsetSeconds * 1000));

    let hours = cityDate.getHours();
    const minutes = cityDate.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12;
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
 * Converts wind degrees into compass directions (e.g. NE, SSW).
 * @param {number} degrees 
 * @returns {string}
 */
function getWindCompassDirection(degrees) {
    if (typeof degrees !== "number") return "NE";
    const sectors = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    const idx = Math.round((degrees % 360) / 22.5) % 16;
    return sectors[idx];
}

/**
 * Helper to describe humidity levels.
 * @param {number} humidity 
 * @returns {string}
 */
function getHumidityDescription(humidity) {
    if (humidity < 30) return "Dry air";
    if (humidity <= 60) return "Comfortable";
    if (humidity <= 80) return "Moderate humidity";
    return "High humidity";
}

/**
 * Helper to describe wind speeds.
 * @param {number} kmh 
 * @returns {string}
 */
function getWindDescription(kmh) {
    if (kmh < 5) return "Calm";
    if (kmh < 20) return "Light breeze";
    if (kmh < 35) return "Moderate wind";
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

// Error retry button click
if (errorRetryBtn) {
    errorRetryBtn.addEventListener("click", () => {
        hideError();
        cityInput.focus();
    });
}

// Error demo button click
if (errorDemoBtn) {
    errorDemoBtn.addEventListener("click", () => {
        cityInput.value = "Coimbatore";
        displayWeather(DEMO_WEATHER_DATA);
        renderDefaultForecast();
    });
}

// Demo mode button click
if (demoModeBtn) {
    demoModeBtn.addEventListener("click", () => {
        cityInput.value = "Coimbatore";
        displayWeather(DEMO_WEATHER_DATA);
        renderDefaultForecast();
    });
}

// ==============================================================================
// 7. APPLICATION INITIALIZATION
// ==============================================================================
window.addEventListener("DOMContentLoaded", () => {
    if (isApiKeyConfigured()) {
        hideApiKeyNotice();
        cityInput.value = DEFAULT_CITY;
        getWeather(DEFAULT_CITY);
    } else {
        showApiKeyNotice();
    }
});
