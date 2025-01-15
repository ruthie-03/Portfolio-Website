// API key for accessing the OpenWeatherMap API
const apiKey = "bb43d7bd6c25f45b46bb577f5aa72550";

// Base URL for fetching current weather data in metric units
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

// Base URL for fetching weather forecast data in metric units
const forecastApiUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";

// Select the input field for entering the city name
const searchBox = document.querySelector(".search input");

// Select the button for triggering the search action
const searchBtn = document.querySelector(".search button");

/**
 * Fetch and display weather information for the specified city
 * @param {string} city - The name of the city to fetch weather data for
 */
async function checkWeather(city) {
    try {
        // Fetch current weather data from the API
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
        
        // Check if the API response is successful; if not, throw an error
        if (!response.ok) {
            throw new Error('City not found');
        }

        // Parse the response JSON data for current weather
        const data = await response.json();
        
        // Call a function to update the UI with weather data
        updateWeather(data);

        // Fetch weather forecast data for the same city
        const forecastResponse = await fetch(forecastApiUrl + city + `&appid=${apiKey}`);
        
        // Parse the response JSON data for the forecast
        const forecastData = await forecastResponse.json();
        
        // Call a function to update the UI with forecast data
        updateForecast(forecastData);
    } catch (error) {
        // Call a function to display error messages in the UI
        showError(error.message);
    }
}

// Clear previous weather details
function updateWeather(data) {
    const weatherDetails = document.querySelector(".weather-details");
    weatherDetails.innerHTML = ''; 

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

// Clear previous forecast items
function updateForecast(data) {
    // Select the container element for the forecast slider
    const forecastSlider = document.querySelector('.forecast-slider');
    
    // Clear previous forecast items by resetting the container's inner HTML
    forecastSlider.innerHTML = ''; 

    // Iterate over each forecast item in the data list
    data.list.forEach((forecast) => {
        // Create a new div element for each forecast item
        const forecastItem = document.createElement('div');
        
        // Add a CSS class to style the forecast item
        forecastItem.classList.add('forecast-item');

        // Convert the forecast's timestamp (in seconds) to a JavaScript Date object
        const date = new Date(forecast.dt * 1000);
        
        // Extract the hour from the date for display
        const hours = date.getHours();
        
        // Get the short name of the day (e.g., "Mon", "Tue") using locale formatting
        const day = date.toLocaleDateString('en-GB', { weekday: 'short' });

        // Populate the forecast item with date, weather icon, and temperature
        forecastItem.innerHTML = `
            <p>${day} ${hours}:00</p>  <!-- Display day and time -->
            <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="Weather icon">
            <p>${Math.round(forecast.main.temp)}°C</p>  <!-- Display temperature rounded to the nearest integer -->
        `;

        // Append the new forecast item to the forecast slider container
        forecastSlider.appendChild(forecastItem);
    });
}

// Displays an error message on the screen and hides the weather details.
function showError(message) {
    // Select the element with the class 'error' and set its text content to the provided message
    document.querySelector(".error").textContent = message;
    // Make the error message visible by changing its display style to 'block'
    document.querySelector(".error").style.display = "block";
    // Hide the weather section by changing its display style to 'none'
    document.querySelector(".weather").style.display = "none";
}

// Updates the background image of the weather card based on the weather condition ID.
function updateBackground(weatherId) {
    // Select the element with the class 'background-card' to apply the background image
    const backgroundCard = document.querySelector('.background-card');
    
// Check the weather ID range and update the background image accordingly
    // Thunderstorm: Weather ID between 200 and 299
    if (weatherId >= 200 && weatherId < 300) {
        backgroundCard.style.backgroundImage = "url('thunderstorm.jpg')";
    // Drizzle: Weather ID between 300 and 399
    } else if (weatherId >= 300 && weatherId < 400) {
        backgroundCard.style.backgroundImage = "url('drizzle.jpg')";
    // Rain: Weather ID between 500 and 599
    } else if (weatherId >= 500 && weatherId < 600) {
        backgroundCard.style.backgroundImage = "url('rain-desktop.jpg')";
    // Snow: Weather ID between 600 and 699
    } else if (weatherId >= 600 && weatherId < 700) {
        backgroundCard.style.backgroundImage = "url('snow.jpg')";
    // Atmosphere (e.g., fog, mist): Weather ID between 700 and 799
    } else if (weatherId >= 700 && weatherId < 800) {
        backgroundCard.style.backgroundImage = "url('atmosphere.jpg')";
    // Clear sky: Weather ID exactly 800
    } else if (weatherId === 800) {
        backgroundCard.style.backgroundImage = "url('sun-flare.jpg')";
    // Clouds: Weather ID between 801 and 899
    } else if (weatherId > 800 && weatherId < 900) {
        backgroundCard.style.backgroundImage = "url('cloudyclouds.jpg')";
    // Default case: If no specific weather condition is matched, set a default background
    } else {
        backgroundCard.style.backgroundImage = "url('default.jpg')";
    }
}

// Add an event listener to the search button that listens for a "click" event
searchBtn.addEventListener("click", () => {
    / When the button is clicked, get the value from the search input box (city name) and pass it to the checkWeather function to fetch the weather data for that city
    checkWeather(searchBox.value);
});

// Geolocation feature: Get the user's current location (latitude and longitude)
navigator.geolocation.getCurrentPosition((position) => {
    // Destructure latitude and longitude from the position object
    const { latitude, longitude } = position.coords;
    // Fetch current weather data using the obtained latitude and longitude
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)
        // Parse the JSON response from the weather API
        .then(response => response.json())
        .then(data => {
            // Update the UI with the current weather data
            updateWeather(data);
            // Fetch the weather forecast data using the same latitude and longitude
            return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
        })
        // Parse the JSON response from the forecast API
        .then(response => response.json())
         // Update the UI with the weather forecast data
        .then(data => updateForecast(data))
       // If any error occurs (e.g., geolocation or API fetch), catch it and display an error message
        .catch(error => showError('Unable to retrieve your location'));
});
