/*jslint es6*/
'use strict';

// TO QUIET JSLINT
var $, console, document, L;

/*
 * INITIALIZES THE MAP WITH A COUPLE BASE LAYERS AND SETS SOME OPTIONS
*/
function initMap(tileUrl, mapCenter, attribution, accessToken) {
    // CREATE OUTDOOR AND SATELLITE BASE MAPS
    var outdoors = L.tileLayer(tileUrl, {
        id: 'mapbox/outdoors-v11',
        r: '@2x',
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        attribution: attribution,
        accessToken: accessToken
    });

    var satellite = L.tileLayer(tileUrl, {
        id: 'mapbox/satellite-v9',
        r: '@2x',
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        attribution: attribution,
        accessToken: accessToken
    });

    // CREATE THE MAP
    var map = L.map('map', {
        center: mapCenter,
        zoom: 12,
        layers: outdoors,
        fullscreenControl: true
    });

    // CREATE THE LAYERS CONTROL
    // WITH THE TWO BASE MAPS
    L.control.layers({
        'Terrain': outdoors,
        'Satellite': satellite
    }).addTo(map);

    return map;
}

/*
 * REQUESTS A GEOJSON FILE SERVED BY FLASK
 * AND ADDS IT AS A LAYER TO THE MAP
*/
function addGeoJSONLayer(fileName, map, options = {}) {
    $.ajax({
        type: 'GET',
        url: 'api/load-geojson/' + fileName,
        dataType: 'json',
        success: function (response) {
            L.geoJson(response, options).addTo(map);
        },
        error: function (response) {
            console.log('error loading geojson file: ' + response.responseText);
        }
    });
}

$(document).ready(function () {
    // SET SOME CONSTANTS FOR THE MAP
    const mapCenter = [34.46, -119.70];
    const tileUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}{r}?&access_token={accessToken}';
    const accessToken = 'pk.eyJ1IjoianN0aG9mZm1hbiIsImEiOiJjaWs0aXJtOGkwMDRtdmxtMmdiaTRkaXA4In0.zu6Ew9PAAPv_ShrQ8zbDlA';
    const attribution = '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>' +
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> ' +
            '<strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>';

    // INITIALIZE THE MAP
    var map = initMap(tileUrl, mapCenter, attribution, accessToken);

    // ADD DATA TO THE MAP
    addGeoJSONLayer('inspiration_point_trail.json', map);
    addGeoJSONLayer('knapps_castle_trail.json', map);
    addGeoJSONLayer('parma_park_trail.json', map);
    addGeoJSONLayer('rattlesnake_canyon_trail.json', map);
    addGeoJSONLayer('saddle_rock_trail.json', map);
});