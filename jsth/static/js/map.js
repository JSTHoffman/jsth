/*
 * Map functionality provided by leaflet.js
*/

$( document ).ready(function() {
    const accessToken = 'pk.eyJ1IjoianN0aG9mZm1hbiIsImEiOiJjaWs0aXJtOGkwMDRtdmxtMmdiaTRkaXA4In0.zu6Ew9PAAPv_ShrQ8zbDlA'
    const attribution = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
    const mapCenter = [34.421349, -119.704355]

    var tileUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}'

    map = initMap(accessToken, attribution, mapCenter, tileUrl)
})

/*
 * INITIALIZES THE MAP WITH A COUPLE BASE LAYERS AND SETS SOME OPTIONS
*/
function initMap(accessToken, attribution, center, tileUrl) {
    // CREATE OUTDOOR AND SATELLITE BASE MAPS
    var outdoors = L.tileLayer(tileUrl, {
        attribution: attribution,
        maxZoom: 18,
        id: 'mapbox.outdoors',
        accessToken: accessToken
    })

    var satellite = L.tileLayer(tileUrl, {
        attribution: attribution,
        maxZoom: 18,
        id: 'mapbox.satellite',
        accessToken: accessToken
    })

    // CREATE THE MAP
    var map = L.map('map', {
        center: center,
        zoom: 11,
        layers: outdoors
    })

    // CREATE THE LAYERS CONTROL
    // WITH THE TWO BASE MAPS
    L.control.layers({
        'Outdoors': outdoors,
        'Satellite': satellite
    }).addTo(map)

    return map
}