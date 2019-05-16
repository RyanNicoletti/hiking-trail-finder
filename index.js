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
    getTrails();
}

// let latitude = coordinatesData.results[0].geometry.location.lat();
// let longitude = coordinatesData.results[0].geometry.location.lng();

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
    .then(hikingData => displayResults(hikingData))
    .catch(err => {
        $('.js-error-message').text(`error: ${err.message}`);
    })
}

function displayResults(hikingData) {
    let latitude = coordinatesData.results[0].geometry.location.lat();
    let longitude = coordinatesData.results[0].geometry.location.lng();
    console.log(hikingData);
    $('#results-list').empty();
}

$(watchForm);