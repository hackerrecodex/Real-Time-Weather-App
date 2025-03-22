const apiKey = 'YOUR_API_KEY'; // Replace with your OpenWeatherMap API key
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const locationBtn = document.getElementById('location-btn');
const weatherDisplay = document.getElementById('weather-display');
const errorMessage = document.getElementById('error-message');
const themeToggle = document.getElementById('theme-toggle');

// Fetch weather data by city name
async function fetchWeather(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();
    if (data.cod === 200) {
      displayWeather(data);
      fetchForecast(data.coord.lat, data.coord.lon);
      errorMessage.style.display = 'none';
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    errorMessage.textContent = error.message;
    errorMessage.style.display = 'block';
  }
}

// Fetch 5-day forecast
async function fetchForecast(lat, lon) {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
  );
  const data = await response.json();
  displayForecast(data);
}

// Display current weather
function displayWeather(data) {
  document.getElementById('city-name').textContent = data.name;
  document.getElementById('current-date').textContent = new Date().toLocaleDateString();
  document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
  document.getElementById('weather-description').textContent = data.weather[0].description;
  document.getElementById('humidity').textContent = data.main.humidity;
  document.getElementById('wind-speed').textContent = data.wind.speed;
  document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
}

// Display 5-day forecast
function displayForecast(data) {
  const forecastDiv = document.getElementById('forecast');
  forecastDiv.innerHTML = '';
  for (let i = 0; i < data.list.length; i += 8) {
    const day = data.list[i];
    const card = `
      <div class="col-md-2">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">${new Date(day.dt_txt).toLocaleDateString()}</h5>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="Weather Icon">
            <p class="card-text">${Math.round(day.main.temp)}°C</p>
            <p class="card-text">${day.weather[0].description}</p>
          </div>
        </div>
      </div>
    `;
    forecastDiv.innerHTML += card;
  }
}

// Event Listeners
searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) fetchWeather(city);
});

locationBtn.addEventListener('click', () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      fetchWeatherByCoords(latitude, longitude);
    });
  }
});

// Theme Toggle
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i> Light Mode' : '<i class="fas fa-moon"></i> Dark Mode';
});
