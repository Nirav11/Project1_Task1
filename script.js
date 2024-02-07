var map = L.map('map').setView([37.0902, -95.7129], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
}).addTo(map);

// Initialize marker cluster group with options for better performance
var markers = L.markerClusterGroup({
    chunkedLoading: true, // Enables loading markers in chunks
    removeOutsideVisibleBounds: true, // Removes markers outside the visible bounds to improve performance
});

// Function to add markers for Emergency Operations Centers
function addEOCMarkers() {
    fetch('https://services1.arcgis.com/Hp6G80Pky0om7QvQ/arcgis/rest/services/Local_Emergency_Operations_Centers_EOC/FeatureServer/0/query?where=1=1&outFields=*&f=geojson')
    .then(response => response.json())
    .then(data => {
        data.features.forEach(feature => {
            var latlng = L.latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
            var popupContent = "<b>Name:</b> " + feature.properties.NAME + "<br>" +
                "<b>Address:</b> " + feature.properties.ADDRESS + "<br>" +
                "<b>Telephone:</b> " + feature.properties.TELEPHONE;
            
            var marker = L.circleMarker(latlng, {
                radius: 6,
                fillColor: "#FF6666",
                color: "#D80000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).bindPopup(popupContent);
            
            markers.addLayer(marker);
        });
        
        map.addLayer(markers);
    });
}

if (map.getZoom() > 6) {
    addEOCMarkers();
}

// Simplify and defer loading of other layers for performance
L.esri.featureLayer({
    url: 'https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/MTBS_Polygons_v1/FeatureServer/0',
    simplifyFactor: 0.5, // Adjust based on zoom level or desired quality
    precision: 5,
}).addTo(map);

// Dynamically load state boundaries based on user interaction to improve initial load time
map.on('zoomend', function() {
    if (map.getZoom() > 5 && !map.hasLayer(usstate)) {
        fetch('https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Boundaries_2022/FeatureServer/1/query?where=1=1&outFields=*&f=geojson')
        .then(response => response.json())
        .then(data => {
            usstate.addData(data);
            map.addLayer(usstate);
        });
    }
});

var usstate = L.geoJSON(null, {
    style: function (feature) {
        return {fill: false, color: 'black', weight: 2, opacity: 1};
    }
});
