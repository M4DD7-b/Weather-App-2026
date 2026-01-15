
/*
    seachInput will contain #search elements value
    weatherDataSection will contain search result
    apiKey will hold OpenWeather API Key
*/
async function fetchWeather() {
    let searchInput = document.getElementById("search").value;
    const weatherDataSection = document.getElementById("weather-data");
    weatherDataSection.style.display = "block";
    /*hide when pushing*/
    const apiKey = "";

    if (searchInput == "") {
        weatherDataSection.innterHTML = `
        <div>
            <h2>Empty Input.</h2>
            <p>Please try again with a valid <u>city name</u>.</p>
        </div>
        `;
        return;
    }

    /*
        returns a response object from api--maybe not immediately
        program is allowed to run ahead even if there is no response
        async/await prevents associated async func from continuing
        until response data is returned from fetch()
        store in a response variables; if response is bad,
        error message is logged and nothing is returned.
    */
    async function getLonAndLat() {
        /*
        countryCode defines location
        geocodeURL defines API endpoint including countryCode and apiKey
        */
        const countryCode = 1;
        const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${searchInput.replace(" ", "%20")},${countryCode}&limit=1&appid=${apiKey}`;
    
        const response = await fetch(geocodeURL);
        if (!response.ok) {
            console.log("Bad response! ", response.status);
            return;
        }

        /* 
            geocode data in JSON format 
            data is coming from response:
            async and await
        */
        const data = await response.json();

        if (data.length == 0) {
            console.log("Something went wrong here.");
            weatherDataSection.innerHTML = `
            <div>
                <h2>Invalid Input: "${searchInput}"</h2>
                <p>Please try again with a valid <u>city name</u>.</p>
            </div>
            `;
            return;
        } else {
            return data[0];
        }
    }

    async function getWeatherData(lon, lat) {
        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

        const response = await fetch(weatherURL);
        if (!response.ok) {
            console.log("Bad response! ", response.status);
            return;
        }

        const data = await response.json();

        weatherDataSection.innerHTML = `
        <img
            src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" 
            alt="$data.weather[0].description" 
            width="100" 
        />
        <div>
            <h2>${data.name}</h2>
            <p><strong>Temperature:</strong> ${Math.round(data.main.temp - 273.15)}\u00B0C</p>
            <p><strong>Description:</strong> ${data.weather[0].description}</p>
        </div>
        `;

        weatherDataSection.style.display = "flex";
        weatherDataSection.innerHTML = `
        <img 
            src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png"
            alt="${data.weather[0].description}"
            width="65"
            height="65"
        />
        <div>
            <h2>${data.name}</h2>
            <p><strong>Temperature:</strong> ${Math.round(data.main.temp - 273.15)}\u00B0C</p>
            <p><strong>Description:</strong> ${data.weather[0].description}</p>
        </div>
        `;
        
    }
    
    document.getElementById("search").value = "";
    const geocodeData = await getLonAndLat();
    getWeatherData(geocodeData.lon, geocodeData.lat);

}