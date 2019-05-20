'use strict';

const googleMapsKey = 'AIzaSyCNNszCTC65ganmb5MVPiQy7Ks48iy9-eI'
const googleMapsBaseURL = 'https://maps.googleapis.com/maps/api/geocode/json'

const hikingKey = '200468808-f04c7a2d896d9c116b7c18e50f208a05'
const hikingBaseURL = 'https://www.hikingproject.com/data/get-trails'

function watchForm() {
    $('form').submit(e => {
        e.preventDefault();
        let searchTerm = $('#js-search-state').val();
        getCoordinates(searchTerm);
    })
}

function formatQueryString(params) {
    const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function getCoordinates(query) {
    const params = {
        key: googleMapsKey,
        address: query,
        language: "en",
    }
    const queryString = formatQueryString(params);
    const googleMapsURL = googleMapsBaseURL + '?' + queryString;

    fetch(googleMapsURL)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText)
    })
    .then(coordinatesData => displayResults(coordinatesData))
    .catch(err => {
        $('.js-error-message').text(`Error: ${err.message}`)
    })
}

function displayResults(coordinatesData) {
    console.log(coordinatesData);
    let latitude = coordinatesData.results[0].geometry.location.lat;
    let longitude = coordinatesData.results[0].geometry.location.lng;
    getTrails(latitude, longitude);
    getWeather(latitude, longitude);
}

function getWeather(latitude, longitude) {
    let weatherURL = `https://cors-anywhere.herokuapp.com/https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&key=fcccba0a1f254fc3a7134d9275b27a32&units=I`
    fetch(weatherURL)
    .then(weatherData => {
        if (weatherData.ok) {
            return weatherData.json();
        }
        throw new Error(weatherData.statusText)
    })
    .then(weatherData => renderWeather(weatherData))
    .catch(err => {
        $('.js-weather-error-message').text(`error: ${err.message}`);
    })
}

function renderWeather(weatherData) {
    console.log(weatherData);
    $('#weather-results').empty();
    $('#weather-results').append(`Weather today in ${weatherData.data[0].city_name}: ${weatherData.data[0].weather.description}.<br>
    Current temperature: ${weatherData.data[0].temp} (feels like: ${weatherData.data[0].app_temp}).`);
    $('.hidden-h2').text('Here Are Some Fun Trails to Hike!');
}

function formatHikingQuery(trailParams) {
    const hikingQueryItems = Object.keys(trailParams)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(trailParams[key])}`);
    return hikingQueryItems.join('&');
}

function getTrails(latitude, longitude) {
    const trailParams = {
        key: hikingKey,
        lat: latitude,
        lon: longitude,
    }
    const hikingQuery = formatHikingQuery(trailParams);
    const hikingURL = hikingBaseURL + '?' + hikingQuery;

    fetch(hikingURL)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText)
    })
    .then(hikingData => renderHikingData(hikingData))
    .catch(err => {
        $('.js-error-message').text(`error: ${err.message}`);
    })
}

function renderHikingData(hikingData) {
    console.log(hikingData);
    $('#results-list').empty();
    for (let i = 0; i<hikingData.trails.length; i++) {
        $('#results-list').append(`<li><h2 class="card-header"><a href = "${hikingData.trails[i].url}">${hikingData.trails[i].name}</a></h2>
        <p class="card-summary">${hikingData.trails[i].summary}</p>
        <p><img src="${hikingData.trails[i].imgSmallMed}" alt="picture of hiking trail"></p>
        <p class="card-distance">Distance: ${hikingData.trails[i].length}miles.</p>
        </li>`)
    }
    $('#results').removeClass('hidden');
    scrollToList();
}

function scrollToList() {
        $('html, body').animate({
            scrollTop: $('#weather-results').offset().top
        }, 1500);
    }

$(watchForm);