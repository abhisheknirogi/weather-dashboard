const apiKey = "7fed12a4f5a5c33cc145d4cb468d5c61"; // 👈 Paste your key here

const searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", () => {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) {
    showError("Please enter a city name!");
    return;
  }

  fetchWeather(city);
});

function fetchWeather(city) {
  const currentURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  Promise.all([fetch(currentURL), fetch(forecastURL)])
    .then(async ([currentRes, forecastRes]) => {
      const currentData = await currentRes.json();
      const forecastData = await forecastRes.json();

      if (currentData.cod != 200) {
        showError("City not found! Try again.");
        return;
      }

      displayCurrentWeather(currentData);
      displayForecast(forecastData);
    })
    .catch(() => showError("Unable to fetch data. Please try again later."));
}

function displayCurrentWeather(data) {
  document.getElementById("errorMsg").textContent = "";

  const div = document.getElementById("currentWeather");
  div.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}">
    <h3>${data.weather[0].description}</h3>
    <p>🌡️ Temp: ${data.main.temp}°C</p>
    <p>💧 Humidity: ${data.main.humidity}%</p>
    <p>💨 Wind: ${data.wind.speed} m/s</p>
  `;
}

function displayForecast(data) {
  const div = document.getElementById("forecast");
  div.innerHTML = "";

  const daily = data.list.filter(item => item.dt_txt.includes("12:00:00"));

  daily.forEach(day => {
    const date = new Date(day.dt_txt).toLocaleDateString();
    const icon = day.weather[0].icon;

    div.innerHTML += `
      <div class="weather-card">
        <h4>${date}</h4>
        <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${day.weather[0].main}">
        <p>${day.weather[0].main}</p>
        <p>${day.main.temp}°C</p>
      </div>
    `;
  });
}

function showError(msg) {
  document.getElementById("errorMsg").textContent = msg;
  document.getElementById("currentWeather").innerHTML = "";
  document.getElementById("forecast").innerHTML = "";
}
