import { sortedApiData, fetchAPIData } from './map.js';

const searchInput = document.getElementById('search-input');
const clearBtn = document.getElementById('clear-btn');
const searchResults = document.getElementById('search-results');
const resultsCount = document.getElementById('results-count');
const sortDistanceBtn = document.getElementById('sort-distance');
const sortNameBtn = document.getElementById('sort-name');

let currentData = [];
let filteredData = [];
let currentSort = 'distance'; // 'distance' or 'name'

// Wait for data to load
async function initializeSearch() {
    // Wait a bit for map.js to load the data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (sortedApiData && sortedApiData.length > 0) {
        currentData = sortedApiData;
    } else {
        currentData = await fetchAPIData();
    }
    
    filteredData = currentData;
    displayResults(filteredData);
}

document.addEventListener('locationUpdated', () => {
    if (currentSort === "distance") {
        currentData = sortedApiData;
        filteredData = applyCurrentSearch(currentData);
        displayResults(filteredData);
    }
});

// Search functionality
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        clearBtn.style.display = 'none';
        filteredData = currentData;
    } else {
        clearBtn.style.display = 'block';
        filteredData = currentData.filter(feature => {
            const name = feature.properties.NAME?.toLowerCase() || '';
            const address = feature.properties.ADDRESSSTREETNAME?.toLowerCase() || '';
            const postalCode = feature.properties.ADDRESSPOSTALCODE?.toLowerCase() || '';
            
            return name.includes(searchTerm) || 
                   address.includes(searchTerm) || 
                   postalCode.includes(searchTerm);
        });
    }
    
    displayResults(filteredData);
});

// Clear search
clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.style.display = 'none';
    filteredData = currentData;
    displayResults(filteredData);
});

// Sort by distance
sortDistanceBtn.addEventListener('click', () => {
    currentSort = 'distance';
    sortDistanceBtn.classList.add('active');
    sortNameBtn.classList.remove('active');
    
    // Re-fetch sorted data from map.js
    if (sortedApiData && sortedApiData.length > 0) {
        currentData = sortedApiData;
        filteredData = applyCurrentSearch(currentData);
        displayResults(filteredData);
    }
});

// Sort by name (A-Z)
sortNameBtn.addEventListener('click', () => {
    currentSort = 'name';
    sortNameBtn.classList.add('active');
    sortDistanceBtn.classList.remove('active');
    
    currentData = [...currentData].sort((a, b) => {
        const nameA = a.properties.NAME || '';
        const nameB = b.properties.NAME || '';
        return nameA.localeCompare(nameB);
    });
    
    filteredData = applyCurrentSearch(currentData);
    displayResults(filteredData);
});

// Apply current search term to data
function applyCurrentSearch(data) {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        return data;
    }
    
    return data.filter(feature => {
        const name = feature.properties.NAME?.toLowerCase() || '';
        const address = feature.properties.ADDRESSSTREETNAME?.toLowerCase() || '';
        const postalCode = feature.properties.ADDRESSPOSTALCODE?.toLowerCase() || '';
        
        return name.includes(searchTerm) || 
               address.includes(searchTerm) || 
               postalCode.includes(searchTerm);
    });
}

// Display results
function displayResults(data) {
    searchResults.innerHTML = '';
    
    // Update count
    resultsCount.textContent = `${data.length} hawker centre${data.length !== 1 ? 's' : ''} found`;
    
    if (data.length === 0) {
        searchResults.innerHTML = '<p class="no-results">No hawker centres found matching your search.</p>';
        return;
    }
    
    data.forEach(feature => {
        const card = createHawkerCard(feature);
        searchResults.appendChild(card);
    });
}

// Create hawker centre card
function createHawkerCard(feature) {
    const props = feature.properties;
    const card = document.createElement('div');
    card.className = 'hawker-card';
    
    const photoUrl = props.PHOTOURL || '/FED-Assignment/img/image-not-found.png';
    
    // Build address
    const address = `${props.ADDRESSBLOCKHOUSENUMBER || ''} ${props.ADDRESSSTREETNAME || ''}, Singapore ${props.ADDRESSPOSTALCODE || ''}`.trim();

    const stallCount = props.NUMBER_OF_COOKED_FOOD_STALLS || 'N/A';

    // google maps directions link
    const [longitude, latitude] = feature.geometry.coordinates;
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    
    card.innerHTML = `
        <div class="hawker-image">
            <img src="${photoUrl}" alt="Image Unavailable">
        </div>
        <div class="hawker-details">
            <h3 class="hawker-name">${props.NAME || 'Unnamed Hawker Centre'}</h3>
            <p class="hawker-address">${address}</p>
            <p class="hawker-stalls">🍽️ ${stallCount} stalls</p>
            <div class="hawker-actions">
                <a href="${directionsUrl}" target="_blank" class="directions-btn">Directions</a>
                <a href="browseStalls.html?hId=${props.OBJECTID}" class="view-stalls-btn">View Stalls →</a>
            </div>
        </div>
    `;
    
    return card;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeSearch);