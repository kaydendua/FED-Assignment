const sgCenter = [1.3521, 103.8198];
const sgBounds = L.latLngBounds([1.130, 103.590], [1.475, 104.100]);

// Downloaded from https://data.gov.sg/datasets/d_4a086da0a5553be1d89383cd90d07ecd/view
// Tried using API calls but could not work because of "Access-Control-Allow-Origin" policy
const url = "/hawker-centre-data/HawkerCentresGEOJSON.geojson";

let userLatLng = sgCenter;
let apiData = {};
export let sortedApiData = {}; // only for use in search.js
let mapCenter;

const loadingPopup = document.getElementById("loadingpopup");
const loadingText = document.getElementById("loadingtext");

const locationUpdatedEvent = new Event('locationUpdated')

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

const userMarker = L.marker(mapCenter, {
    draggable: false 
}).addTo(map);
userMarker._icon.classList.add("huechange");

userMarker.on('dragend', async function () {
    const userLatLng = userMarker.getLatLng();
    const {lat, lng} = userLatLng;
    sessionStorage.setItem("userLatLng", JSON.stringify([lat, lng]));
    map.setView(userLatLng);

    sortedApiData = sortByDistance(lat, lng, apiData);
    document.dispatchEvent(locationUpdatedEvent);
});

map.on('click', async function (location) {
    if (userMarker.dragging.enabled()) {
        userMarker.setLatLng(location.latlng);
        sessionStorage.setItem("userLatLng", JSON.stringify([location.latlng.lat, location.latlng.lng]));
        map.setView(location.latlng);

        sortedApiData = sortByDistance(location.latlng.lat, location.latlng.lng, apiData);
        document.dispatchEvent(locationUpdatedEvent);
    }
});

function loadMarkers(apiData) {
    for (const feature of apiData) {
        const location = feature.geometry.coordinates;
        const latLng = [location[1], location[0]];
        const newMarker = L.marker(latLng, {
            draggable: false
        })
        newMarker.bindPopup(`<b>${feature.properties.NAME}</b><br>${feature.properties.ADDRESSSTREETNAME} ${feature.properties.ADDRESSPOSTALCODE}`);
        newMarker.addTo(map);
    }
}

function sortByDistance(userLat, userLng, apiData) {
    apiData.sort((a, b) => {
        const [lonA, latA] = a.geometry.coordinates;
        const [lonB, latB] = b.geometry.coordinates;
        const distanceA = haversineDistance(userLat, userLng, latA, lonA);
        const distanceB = haversineDistance(userLat, userLng, latB, lonB);
        return distanceA - distanceB;
    });
    
    return apiData;
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

export async function fetchAPIData() {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        return data.features;
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
}

function setViewToLocation(latLng) {
    userMarker.setLatLng(latLng);
    map.setView(latLng, 15);
    userMarker.bindPopup("<b>You are here!</b><br>Try dragging this marker around.").openPopup();
}

document.addEventListener('DOMContentLoaded', async function() {
    apiData = await fetchAPIData();

    if (sessionStorage.getItem("userLatLng")) {
        userLatLng = JSON.parse(sessionStorage.getItem("userLatLng"));
        loadingPopup.classList.add("hidden");
        setViewToLocation(userLatLng);
    } else {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition( function (position) {
                userLatLng = [position.coords.latitude, position.coords.longitude];
                sessionStorage.setItem("userLatLng", JSON.stringify(userLatLng));
                loadingPopup.classList.add("hidden");
                setViewToLocation(userLatLng);
            });
        } else {
            loadingText.innerText = "Geolocation not enabled/supported by your browser.";
            userLatLng = sgCenter;
            sessionStorage.setItem("userLatLng", JSON.stringify(userLatLng));
            setViewToLocation(userLatLng);
            setTimeout(() => {
                loadingPopup.classList.add("hidden");
            }, 3000);
        }
    } 

    userMarker.dragging.enable();
    loadMarkers(apiData);
    sortedApiData = sortByDistance(userLatLng[0], userLatLng[1], apiData);
});