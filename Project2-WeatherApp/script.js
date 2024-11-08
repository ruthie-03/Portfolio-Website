const apiKey = "bb43d7bd6c25f45b46bb577f5aa72550";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const forecastApiUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");

async function checkWeather(city) {
    try {
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
        if (!response.ok) {
            throw new Error('City not found');
        }
        const data = await response.json();
        updateWeather(data);

        const forecastResponse = await fetch(forecastApiUrl + city + `&appid=${apiKey}`);
        const forecastData = await forecastResponse.json();
        updateForecast(forecastData);
    } catch (error) {
        showError(error.message);
    }
}

function updateWeather(data) {
    const weatherDetails = document.querySelector(".weather-details");
    weatherDetails.innerHTML = ''; // Clear previous weather details

    const weatherId = data.weather[0].id;
    updateBackground(weatherId);

    // Create and append city name element
    const cityElement = document.createElement('div');
    cityElement.classList.add('city');
    cityElement.innerHTML = data.name;
    weatherDetails.appendChild(cityElement);

    // Create and append temperature element
    const tempElement = document.createElement('div');
    tempElement.classList.add('temp');
    tempElement.innerHTML = Math.round(data.main.temp) + "°C";
    weatherDetails.appendChild(tempElement);

    // Create and append feels like temperature element
    const feelsLikeElement = document.createElement('div');
    feelsLikeElement.classList.add('feels-like');
    feelsLikeElement.innerHTML = `Feels like: ${Math.round(data.main.feels_like)}°C`;
    weatherDetails.appendChild(feelsLikeElement);

    // Create and append weather description element
    const descriptionElement = document.createElement('div');
    descriptionElement.classList.add('description');
    descriptionElement.innerHTML = data.weather[0].description;
    weatherDetails.appendChild(descriptionElement);

    // Create and append weather icon element
    const weatherIcon = document.createElement('img');
    weatherIcon.classList.add('weather-icon');
    weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`; // Set icon URL from API
    weatherIcon.alt = "Weather icon";
    weatherDetails.appendChild(weatherIcon);

    // Create and append humidity element with icon
    const humidityElement = document.createElement('div');
    humidityElement.classList.add('humidity');
    humidityElement.innerHTML = `<i class="fas fa-tint"></i> Humidity: ${data.main.humidity}%`;
    weatherDetails.appendChild(humidityElement);

    // Create and append wind speed element with icon
    const windElement = document.createElement('div');
    windElement.classList.add('wind');
    windElement.innerHTML = `<i class="fas fa-wind"></i> Wind Speed: ${data.wind.speed} km/h`;
    weatherDetails.appendChild(windElement);

    // Show the weather section and hide the error message
    document.querySelector(".weather").style.display = "block";
    document.querySelector(".error").style.display = "none";
}

function updateForecast(data) {
    const forecastSlider = document.querySelector('.forecast-slider');
    forecastSlider.innerHTML = ''; // Clear previous forecast items

    data.list.forEach((forecast) => {
        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');

        const date = new Date(forecast.dt * 1000);
        const hours = date.getHours();
        const day = date.toLocaleDateString('en-GB', { weekday: 'short' });

        forecastItem.innerHTML = `
            <p>${day} ${hours}:00</p>
            <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="Weather icon">
            <p>${Math.round(forecast.main.temp)}°C</p>
        `;

        forecastSlider.appendChild(forecastItem);
    });
}

function showError(message) {
    document.querySelector(".error").textContent = message;
    document.querySelector(".error").style.display = "block";
    document.querySelector(".weather").style.display = "none";
}

function updateBackground(weatherId) {
    const backgroundCard = document.querySelector('.background-card');

    if (weatherId >= 200 && weatherId < 300) {
        backgroundCard.style.backgroundImage = "url('thunderstorm.jpg')";
    } else if (weatherId >= 300 && weatherId < 400) {
        backgroundCard.style.backgroundImage = "url('drizzle.jpg')";
    } else if (weatherId >= 500 && weatherId < 600) {
        backgroundCard.style.backgroundImage = "url('rain-desktop.jpg')";
    } else if (weatherId >= 600 && weatherId < 700) {
        backgroundCard.style.backgroundImage = "url('snow.jpg')";
    } else if (weatherId >= 700 && weatherId < 800) {
        backgroundCard.style.backgroundImage = "url('atmosphere.jpg')";
    } else if (weatherId === 800) {
        backgroundCard.style.backgroundImage = "url('sun-flare.jpg')";
    } else if (weatherId > 800 && weatherId < 900) {
        backgroundCard.style.backgroundImage = "url('cloudyclouds.jpg')";
    } else {
        backgroundCard.style.backgroundImage = "url('default.jpg')";
    }
}

searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});

// Optional: Add geolocation feature
navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords;
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            updateWeather(data);
            return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
        })
        .then(response => response.json())
        .then(data => updateForecast(data))
        .catch(error => showError('Unable to retrieve your location'));
});
