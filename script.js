
const apiKey = "f623f5b103a0c4eb5b6a74791915b0fa";
let tempChart;
let unit = "metric";
async function getWeather() {

    const city = document.getElementById("city").value;

    if(city === ""){
        alert("Please enter a city name.");
        return;
    }

    const url =
`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
    try{

        const response = await fetch(url);

        if(!response.ok){
            throw new Error("City not found");
        }

        const data = await response.json();
        saveSearch(data.name);
const weather = data.weather[0].main;
const tipsBox = document.querySelector(".tips");

tipsBox.className = "tips";

switch(weather){

    case "Clear":
        tipsBox.classList.add("clear-bg");
        break;

    case "Clouds":
        tipsBox.classList.add("cloud-bg");
        break;

    case "Rain":
    case "Drizzle":
        tipsBox.classList.add("rain-bg");
        break;

    case "Thunderstorm":
        tipsBox.classList.add("storm-bg");
        break;

    case "Snow":
        tipsBox.classList.add("snow-bg");
        break;

    case "Mist":
    case "Fog":
        tipsBox.classList.add("fog-bg");
        break;

    default:
        tipsBox.classList.add("default-bg");
}
let tip = "";

switch (weather) {
    case "Clear":
        tip = "☀️ Perfect day for outdoor activities. Stay hydrated!";
        break;

    case "Clouds":
        tip = "☁️ Cloudy weather. Carry sunglasses just in case.";
        break;

    case "Rain":
        tip = "🌧️ Don't forget an umbrella and waterproof shoes.";
        break;

    case "Thunderstorm":
        tip = "⛈️ Stay indoors and avoid open areas.";
        break;

    case "Snow":
        tip = "❄️ Wear warm clothes and drive carefully.";
        break;

    case "Mist":
    case "Fog":
        tip = "🌫️ Drive slowly. Visibility may be low.";
        break;

    case "Drizzle":
        tip = "🌦️ Light rain expected. Keep a raincoat handy.";
        break;

    default:
        tip = "🌍 Have a great day and check the latest weather updates.";
}

document.getElementById("tip").innerText = tip;


      document.getElementById("cityName").innerText =
        data.name + ", " + data.sys.country;

        document.getElementById("temp").innerText =
        Math.round(data.main.temp) + "°C";

        document.getElementById("condition").innerText =
        data.weather[0].main;

        document.getElementById("humidity").innerText =
        data.main.humidity + "%";

        document.getElementById("wind").innerText =
        data.wind.speed + " km/h";

        document.getElementById("icon").src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        getForecast(city);
        document.getElementById("country").innerText = data.sys.country;

document.getElementById("pressure").innerText =
data.main.pressure + " hPa";

document.getElementById("feels").innerText =
Math.round(data.main.feels_like) + "°C";

document.getElementById("visibility").innerText =
(data.visibility / 1000).toFixed(1) + " km";

document.getElementById("sunrise").innerText =
new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
});

document.getElementById("sunset").innerText =
new Date(data.sys.sunset * 1000).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
});

    }

    catch(error){

        document.getElementById("cityName").innerText = "City Not Found";
document.getElementById("temp").innerText = "--°C";
document.getElementById("condition").innerText = "Please enter a valid city";
document.getElementById("icon").src = "";

    }

}document.getElementById("city").addEventListener("keypress", function(event){
    if(event.key === "Enter"){
        getWeather();
    }
});window.onload = function(){

    showHistory();

    document.getElementById("city").value = "Chennai";

    getWeather();

};
async function getForecast(city){

    const url =
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    const response = await fetch(url);

    const data = await response.json();

    const forecastContainer = document.getElementById("forecast");
forecastContainer.innerHTML = "";

const labels = [];
const temps = [];

const dailyData = [];

data.list.forEach(item => {

    if(item.dt_txt.includes("12:00:00")){
        dailyData.push(item);
    }

});

dailyData.slice(0,5).forEach(item => {

    const day = new Date(item.dt_txt)
    .toLocaleDateString("en-US",{weekday:"short"});

    labels.push(day);
    temps.push(Math.round(item.main.temp));

    const card = `
    <div class="forecast-card">

        <p>${day}</p>

        <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png">

        <h3>${Math.round(item.main.temp)}${unit === "metric" ? "°C" : "°F"}</h3>

    </div>
    `;

    forecastContainer.innerHTML += card;

});   // <-- forEach ends here

// ================== ADD THIS ==================

if (tempChart) {
    tempChart.destroy();
}

const ctx = document.getElementById("tempChart").getContext("2d");

tempChart = new Chart(ctx, {
    type: "line",
    data: {
        labels: labels,
        datasets: [{
            label: "Temperature",
            data: temps,
            borderColor: "#00d4ff",
            backgroundColor: "rgba(0,212,255,0.2)",
            fill: true,
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                labels: {
                    color: "white"
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: "white"
                }
            },
            y: {
                ticks: {
                    color: "white"
                }
            }
        }
    }
});

// ==============================================

}function updateClock() {

    const now = new Date();

    const day = now.toLocaleDateString("en-US", {
        weekday: "long"
    });

    const time = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"   // <-- Seconds also show
    });

    document.getElementById("day").innerText = day;
    document.getElementById("time").innerText = time;
}

// Run once immediately
// Run once immediately
updateClock();
updateGreeting();

// Update every second
setInterval(() => {
    updateClock();
    updateGreeting();
}, 1000);function saveSearch(city) {

    let history = JSON.parse(localStorage.getItem("history")) || [];

    // Remove duplicate
    history = history.filter(item => item.toLowerCase() !== city.toLowerCase());

    // Add newest search to beginning
    history.unshift(city);

    // Keep only last 5 searches
    history = history.slice(0, 5);

    localStorage.setItem("history", JSON.stringify(history));

    showHistory();
}

function showHistory() {

    const history = JSON.parse(localStorage.getItem("history")) || [];

    const list = document.getElementById("historyList");

    list.innerHTML = "";

    history.forEach(city => {

        list.innerHTML += `<li onclick="searchHistory('${city}')">${city}</li>`;

    });

}

function searchHistory(city){

    document.getElementById("city").value = city;

    getWeather();

}function getLocation(){

    if(navigator.geolocation){

        navigator.geolocation.getCurrentPosition(showPosition);

    }else{

        alert("Geolocation is not supported.");

    }

}

async function showPosition(position){

    const lat = position.coords.latitude;

    const lon = position.coords.longitude;

    const url =
`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    const response = await fetch(url);

    const data = await response.json();

    document.getElementById("city").value = data.name;

    getWeather();

}function updateGreeting(){

    const hour = new Date().getHours();

    let greeting = "";

    if(hour < 12){
        greeting = "🌅 Good Morning";
    }
    else if(hour < 17){
        greeting = "☀️ Good Afternoon";
    }
    else if(hour < 20){
        greeting = "🌇 Good Evening";
    }
    else{
        greeting = "🌙 Good Night";
    }

    document.getElementById("greeting").innerText = greeting;
}

updateGreeting();function changeUnit(selectedUnit){

    unit = selectedUnit;

    getWeather();

}