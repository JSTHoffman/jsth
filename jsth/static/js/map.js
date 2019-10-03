'use strict';

// GEOJSON TRAIL FILES
const trailsFile = 'hiked_trails.geojson';

// MAP HIKING PROJECT
// DIFFICULTIES TO COLORS
const difficultyColors = {
    'green': '#588f00',
    'greenBlue': '#588f00',
    'blue': '#0066CC',
    'blueBlack': '#0066CC',
    'black': '#000000',
    'dblack': '#000000'
};

// MAP HIKING PROJECT
// DIFFICULTIES TO OPACITIES
const difficultyOpacities = {
    'green': 0.5,
    'greenBlue': 0.7,
    'blue': 0.5,
    'blueBlack': 0.7,
    'black': 0.5,
    'dblack': 0.7
};

// SET SOME CONSTANTS FOR THE MAP
const mapCenter = [34.46, -119.70],
      tileUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}{r}?&access_token={accessToken}',
      mapboxToken = 'pk.eyJ1IjoianN0aG9mZm1hbiIsImEiOiJjaWs0aXJtOGkwMDRtdmxtMmdiaTRkaXA4In0.zu6Ew9PAAPv_ShrQ8zbDlA',
      hikingProjectToken = '200606332-fd1a92df7d06380da4b27698ec4ca2cf',
      attribution = '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>' +
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> ' +
        '<strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>';

// CREATE OUTDOOR AND SATELLITE BASE LAYERS
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

// MAKE THE MAP AND IT'S LAYER
// CONTROL ACCESSIBLE EVERYWHERE
var map, layerControl;

// OBJECT FOR STORING TRAILHEADS CURRENTLY
// ON THE MAP AS WELL AS THE MAP FEATURES
var trailheads = {
    current: [],
    featureGroup: L.featureGroup()
};

/*
 * PRINTS SOME INFO TO THE CONSOLE
 * WHEN USER GEOLOCATION IS SUCCESSFUL
*/
function onLocationFound(e) {
    console.log(
        'Geolocation successful: ' + e.latlng +
        ', Accuracy: ' + e.accuracy
    );
}

/*
 * PRINTS SOME INFO TO THE CONSOLE
 * WHEN USER GEOLOCATION FAILS
*/
function onLocationError(e) {
    console.log(e.message);
}

/*
 * REQUESTS A GEOJSON FILE SERVED BY FLASK
 * AND LOADS IT AS A LEAFLET GEOJSON LAYER
*/
function loadGeoJSONLayer(fileName, layerName, options = {}) {
    $.ajax({
        type: 'GET',
        url: 'api/get-geojson/' + fileName,
        dataType: 'json',
        success: function (response) {
            var geoJSONLayer = L.geoJSON(response, options);

            // ADD LAYER TO MAP AND LAYER CONTROL
            geoJSONLayer.addTo(map);
            layerControl.addOverlay(geoJSONLayer, layerName);
        },
        error: function (response) {
            console.log('Error loading geojson file: ' + response.responseText);
        }
    });
}

/*
 * LOADS THE HIKED TRAILS GEOJSON FILE AND ADDS IT'S
 * FEATURES TO THE MAP WITH STYLING AND POPUP OPTIONS
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
            layer.bindPopup('<p class="lead trail-popup">' + feature.properties.Name + '</p>');
        }
    });
}

/*
 * CREATES THE POPUP CONTENT
 * FOR A TRAILHEAD MARKER
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
 * LOADS TRAILHEAD DATA FROM THE HIKING PROJECT
 * AND ADDS EACH FEATURE TO THE MAP AS A CIRCLE MARKER
 * WITH STYLING, POPUP, AND TOOLTIP OPTIONS
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
                // ADD TRAILHEADS GROUP TO THE MAP IF IT HASN'T BEEN
                if (map.hasLayer(trailheads.featureGroup) == false) {
                    trailheads.featureGroup.addTo(map);
                }

                // ADD NEW TRAILHEADS TO THE MAP
                if (trailheads.current.includes(trail.id) == false) {
                    trailheads.current.push(trail.id);

                    var marker = L.circleMarker([trail.latitude, trail.longitude], {
                        radius: 6,
                        stroke: false,
                        color: difficultyColors[trail.difficulty],
                        fill: true,
                        fillOpacity: difficultyOpacities[trail.difficulty]
                    });

                    marker.bindPopup(trailheadPopup(trail));
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
 * EXECUTED ON THE MAPS MOVEEND EVENT
*/
function onMoveEnd() {
    // LOAD MORE TRAILHEADS
    loadTrailheads();
    console.log('Total trails: ' + trailheads.current.length);
}

$(document).ready(function () {
    // CREATE THE MAP
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

    // CREATE A LAYER CONTROL THAT
    // WE CAN START ADDING DATA TO
    layerControl = L.control.layers(baseLayers, overlayLayers, {
        position: 'topleft'
    }).addTo(map);

    // LOAD HIKED TRAIL DATA ASYNCHRONOUSLY AND
    // ADD IT TO THE MAP AND LAYER CONTROL
    loadHikedTrails();

    // LOAD TRAILHEAD DATA ASYNCHRONOUSLY AND
    // ADD IT TO THE MAP AND LAYER CONTROL
    loadTrailheads();

    // SET THE ZOOM CONTROL POSITION
    map.zoomControl.setPosition('topright');

    // ADD A GEOLOCATION CONTROL TO THE MAP
    L.control.locate({
        position: 'topright',
        drawMarker: false,
        icon: 'fas fa-crosshairs'
    }).addTo(map);

    // ADD A FULLSCREEN CONTROL
    map.addControl(new L.Control.Fullscreen({
        position: 'topright'
    }));

    // ADD A SCALE BAR TO THE MAP
    L.control.scale().addTo(map);

    // ADD GEOLOCATION EVENT LISTENERS
    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);

    // ADD MOVEEND EVENT LISTENER THAT LOADS
    // MORE TRAILHEADS WHEN THE MAP IS MOVED
    map.on('moveend', onMoveEnd);
});