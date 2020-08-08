'use strict';

import { createAlert } from './base.js';
import { geoJSONLength } from './geojson-length.js';

// GeoJSON trail files
const trailsFile = 'hiked_trails.geojson';

// Map Hiking Project
// difficulties to colors
const difficultyColors = {
    'green': '#588f00',
    'greenBlue': '#588f00',
    'blue': '#0066CC',
    'blueBlack': '#0066CC',
    'black': '#000000',
    'dblack': '#000000'
};

// Map Hiking Project
// difficulties to opacities
const difficultyOpacities = {
    'green': 0.5,
    'greenBlue': 0.7,
    'blue': 0.5,
    'blueBlack': 0.7,
    'black': 0.5,
    'dblack': 0.7
};

// Set some constants for the map
const mapCenter = [34.46, -119.70],
      tileUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}{r}?&access_token={accessToken}',
      mapboxToken = 'pk.eyJ1IjoianN0aG9mZm1hbiIsImEiOiJjaWs0aXJtOGkwMDRtdmxtMmdiaTRkaXA4In0.zu6Ew9PAAPv_ShrQ8zbDlA',
      hikingProjectToken = '200606332-fd1a92df7d06380da4b27698ec4ca2cf',
      attribution = '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>' +
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> ' +
        '<strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>';

// Create outdoor and satellite base layers
var outdoors = L.tileLayer(tileUrl, {
    id: 'mapbox/outdoors-v11',
    r: '@2x',
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    attribution: attribution,
    accessToken: mapboxToken
});

var satellite = L.tileLayer(tileUrl, {
    id: 'mapbox/satellite-v9',
    r: '@2x',
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    attribution: attribution,
    accessToken: mapboxToken
});

// Make the map and it's layer
// control accessible everywhere
var map, layerControl;

// Object for storing trailheads currently
// on the map as well as the map features
var trailheads = {
    current: [],
    featureGroup: L.featureGroup()
};

/*
 * Prints some info to the console
 * when user geolocation is successful
*/
function onLocationFound(e) {
    console.log(
        'Geolocation successful: ' + e.latlng +
        ', Accuracy: ' + e.accuracy
    );
}

/*
 * Prints some info to the console
 * when user geolocation fails
*/
function onLocationError(e) {
    console.log(e.message);
}

/*
 * Requests a GeoJSON file served by flask
 * and loads it as a leaflet GeoJSON layer
*/
function loadGeoJSONLayer(fileName, layerName, options = {}) {
    $.ajax({
        type: 'GET',
        url: 'api/get-geojson/' + fileName,
        dataType: 'json',
        success: function (response) {
            response.features.forEach(function (feature) {
                if (feature.geometry.type === 'LineString' || 'MultiLineString') {
                    var length = geoJSONLength(feature.geometry);
                    feature.properties.length = length;
                    console.log(feature.properties.name + ': ' + feature.properties.length);
                }
            });

            var geoJSONLayer = L.geoJSON(response, options);

            // Add layer to map and layer control
            geoJSONLayer.addTo(map);
            layerControl.addOverlay(geoJSONLayer, layerName);
        },
        error: function (response) {
            console.log('Error loading geojson file: ' + response.responseText);
            createAlert('Error loading geojson file: ' + fileName, 'danger');
        }
    });
}

/*
 * Creates the popup content for a hiked trail
 */
function hikedTrailPopup (trail) {
    return '<div class="container-fluid">' +
           '  <div class="row">' +
           '    <div class="column">' +
           '      <p class="lead trail-popup">' + trail.properties.name + '</p>' +
           '      <p>Round trip distance: ' + trail.properties.length.toFixed(2) + ' miles.</p>' +
           '    </div>' +
           '  </div>' +
           '</div>';
}

/*
 * Loads the hiked trails GeoJSON file and adds it's
 * features to the map with styling and popup options
*/
function loadHikedTrails() {
    loadGeoJSONLayer(trailsFile, 'Hiked Trails', {
        style: {
            color: '#BF3026',
            opacity: 0.9,
            dashArray: '4 6',
            className: 'hiked-trail'
        },
        onEachFeature: function (feature, layer) {
            // Add a popup to the trail layer
            layer.bindPopup(hikedTrailPopup(feature));
        }
    });
}

/*
 * Creates the popup content
 * for a trailhead marker
*/
function trailheadPopup(trail) {
    return '<div class="container-fluid">' +
           '    <div class="row">' +
           '        <div class="column">' +
           '            <p class="lead">' + trail.name + '</p>' +
           '            <img class="shadow p-0 w-100" src="' + trail.imgSmall + '"></img>' +
           '        </div>' +
           '    </div>' +
           '</div>';
}

/*
 * Loads trailhead data from The Hiking Project
 * and adds each feature to the map as a circle marker
 * with styling, popup, and tooltip options
*/
function loadTrailheads() {
    $.ajax({
        type: 'GET',
        url: 'https://www.hikingproject.com/data/get-trails',
        data: {
            key: hikingProjectToken,
            lat: map.getCenter().lat,
            lon: map.getCenter().lng,
            maxDistance: 20,
            maxResults: 500
        },
        dataType: 'json',
        success: function (response) {
            response.trails.forEach(function (trail) {
                // Add trailheads group to the map if it hasn't been
                if (map.hasLayer(trailheads.featureGroup) == false) {
                    trailheads.featureGroup.addTo(map);
                }

                // Add new trailheads to the map
                if (trailheads.current.includes(trail.id) == false) {
                    trailheads.current.push(trail.id);

                    // Create the trailhead marker
                    var marker = L.circleMarker([trail.latitude, trail.longitude], {
                        radius: 6,
                        stroke: false,
                        color: difficultyColors[trail.difficulty],
                        fill: true,
                        fillOpacity: difficultyOpacities[trail.difficulty]
                    });

                    marker.bindPopup(trailheadPopup(trail));
                    // Add the marker to the trailheads feature group
                    marker.addTo(trailheads.featureGroup);
                }
            });
        },
        error: function (response) {
            console.log('Error loading hiking project trails: ' + response.responseText);

        }
    });
}

/*
 * Executed on the map's moveend event
*/
function onMoveEnd() {
    // Load more trailheads
    loadTrailheads();
    console.log('Total trails: ' + trailheads.current.length);
}

$(document).ready(function () {
    // Create the map
    map = L.map('map', {
        center: mapCenter,
        zoom: 12,
        layers: outdoors
    });

    var baseLayers = {
        'Outdoors': outdoors,
        'Satellite': satellite
    };

    var overlayLayers = {
        'Trail Heads': trailheads.featureGroup
    };

    // Create a layer control that
    // we can start adding data to
    layerControl = L.control.layers(baseLayers, overlayLayers, {
        position: 'topleft'
    }).addTo(map);

    // Load hiked trail data asynchronously and
    // add it to the map and layer control
    loadHikedTrails();

    // Load trailhead data asynchronously and
    // add it to the map and layer control
    loadTrailheads();

    // Set the zoom control position
    map.zoomControl.setPosition('topright');

    // Add a geolocation control to the map
    L.control.locate({
        position: 'topright',
        drawMarker: false,
        icon: 'fas fa-crosshairs'
    }).addTo(map);

    // Add a fullscreen control to the map
    map.addControl(new L.Control.Fullscreen({
        position: 'topright'
    }));

    // Add a scale bar to the map
    L.control.scale().addTo(map);

    // Add geolocation event listeners
    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);

    // Add moveend event listener that loads
    // more trailheads when the map is moved
    map.on('moveend', onMoveEnd);
});
