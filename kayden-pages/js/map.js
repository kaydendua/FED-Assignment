const sgCenter = [1.3521, 103.8198];
const sgBounds = L.latLngBounds([1.130, 103.590], [1.475, 104.100]);
let userLatLng = sgCenter;

const tempInfoURL = "https://api-open.data.gov.sg/v2/real-time/api/air-temperature";
const humidityInfoURL = "https://api-open.data.gov.sg/v2/real-time/api/relative-humidity";

let fallbackData = {};
let apiData = {};
let mapCenter;

const loadingPopup = document.getElementById("loadingpopup");
const loadingText = document.getElementById("loadingtext");

if (sessionStorage.getItem("userLatLng")) {
    mapCenter = JSON.parse(sessionStorage.getItem("userLatLng"));
    loadingPopup.classList.add("hidden");
} else {
    mapCenter = sgCenter;
}

const map = L.map('map', {
    center: mapCenter,
    zoom: 12,
    minZoom: 11,
    maxBounds: sgBounds,
    maxBoundsViscosity: 1
})

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const marker = L.marker(mapCenter, {
    draggable: false //
}).addTo(map);

marker.on('dragend', async function () {
    const {lat, lng} = marker.getLatLng();
    sessionStorage.setItem("userLatLng", JSON.stringify([lat, lng]));
    let weatherData = fetchWeatherDataAtLocation(lat, lng);
    showWeatherData(weatherData)
});

map.on('click', async function (location) {
    if (marker.dragging.enabled()) {
        marker.setLatLng(location.latlng);
        sessionStorage.setItem("userLatLng", JSON.stringify([location.latlng.lat, location.latlng.lng]));
        let weatherData = fetchWeatherDataAtLocation(location.latlng.lat, location.latlng.lng);
        showWeatherData(weatherData);
    }
});

function showWeatherData(weatherData) {
    console.log("Weather Data:", weatherData);
}

function fetchWeatherDataAtLocation(lat, lng) {
    const nearestStationID = getNearestWeatherStation(lat, lng);

    if (!apiData.tempData) {
        if (!fallbackData.tempData) {
            fallbackData = JSON.parse(sessionStorage.getItem("fallbackData"));
        }
        apiData = fallbackData;
    }
    
    let weatherData = {};
    weatherData["temperature"] = apiData.tempData.data.readings[0].data.find(reading => reading.stationId === nearestStationID).value;
    weatherData["humidity"] = apiData.humidityData.data.readings[0].data.find(reading => reading.stationId === nearestStationID).value;

    return weatherData;
}

function getNearestWeatherStation(lat, lng) {
    let stationLatLngList = [];
    for (let station of apiData.tempData.data.stations) {
        stationLatLngList.push([station.id, station.location.latitude, station.location.longitude]);
    }

    let minDiff;
    let nearestStationID;
    for (let stationLatLng of stationLatLngList) {
        let latLngDiff = haversineDistance(lat, lng, stationLatLng[1], stationLatLng[2]);
        if (latLngDiff < minDiff || minDiff === undefined) {
            minDiff = latLngDiff;
            nearestStationID = stationLatLng[0];
        }
    }

    return nearestStationID;
}

function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const toRad = deg => deg * Math.PI / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

async function fetchAPIData() {
    try {
        // Fetch temperature data  
        const tempData = await (await fetch(tempInfoURL)).json();
            
        // Fetch humidity data  
        const humidityData = await (await fetch(humidityInfoURL)).json();

        fallbackData = { "tempData":tempData, "humidityData":humidityData };
        sessionStorage.setItem("fallbackData", JSON.stringify(apiData));
        return {"tempData":tempData, "humidityData":humidityData };
            
    } catch (error) {
        console.error("API fetch error:", error);
        if (fallbackData == {}) {
            fallbackData = JSON.parse(sessionStorage.getItem("fallbackData"));
        } 
        return fallbackData
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    if (sessionStorage.getItem("apiData")) {
        apiData = JSON.parse(sessionStorage.getItem("apiData"));
        if (Date.now() - new Date(apiData.tempData.data.readings[0].timestamp) > 10 * 60 * 1000) {
            apiData = await fetchAPIData();
            sessionStorage.setItem("apiData", JSON.stringify(apiData));
        }
    } else {
        apiData = await fetchAPIData();
        sessionStorage.setItem("apiData", JSON.stringify(apiData));
    }
    
    if (sessionStorage.getItem("userLatLng")) {
        console.log("Found userLatLng in sessionStorage");
        console.log("UserLatLng string:", sessionStorage.getItem("userLatLng"));
        userLatLng = JSON.parse(sessionStorage.getItem("userLatLng"));
        loadingPopup.classList.add("hidden");
        setViewToUserLocation();
    } else {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition( function (position) {
                userLatLng = [position.coords.latitude, position.coords.longitude];
                sessionStorage.setItem("userLatLng", JSON.stringify(userLatLng));
                loadingPopup.classList.add("hidden");
                setViewToUserLocation();
            });
        } else {
            loadingText.innerText = "Geolocation not enabled/supported by your browser.";
            userLatLng = sgCenter;
            sessionStorage.setItem("userLatLng", JSON.stringify(userLatLng));
            setViewToUserLocation();
            setTimeout(() => {
                loadingPopup.classList.add("hidden");
            }, 3000);
        }
    } 
    
    function setViewToUserLocation() {
        marker.setLatLng(userLatLng);
        map.setView(userLatLng, 17);
        marker.bindPopup("<b>You are here!</b><br>Scroll down for weather info.").openPopup();
    }

    showWeatherData(fetchWeatherDataAtLocation(userLatLng[0], userLatLng[1]));
    setInterval(async function() {
        apiData = await fetchAPIData();
        sessionStorage.setItem("apiData", JSON.stringify(apiData));
    }, 10 * 60 * 1000);
    marker.dragging.enable();
});