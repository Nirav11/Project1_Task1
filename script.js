var map = L.map('map').setView([37.0902, -95.7129], 4);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
}).addTo(map);

var markers = L.markerClusterGroup();

// Fetching data for markers for the Emergency Response Centre
fetch('https://services1.arcgis.com/Hp6G80Pky0om7QvQ/arcgis/rest/services/Local_Emergency_Operations_Centers_EOC/FeatureServer/0/query?where=1=1&outFields=*&f=geojson')
.then(response => response.json())
.then(data => {
    data.features.forEach(feature => {
        var latlng = L.latLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
        var popupContent = `<b>Name:</b> ${feature.properties.NAME}<br><b>Address:</b> ${feature.properties.ADDRESS}<br><b>Telephone:</b> ${feature.properties.TELEPHONE}`;

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

// Adding an Forest Fire Esri Feature Layer
L.esri.featureLayer({
    url: 'https://services2.arcgis.com/bB9Y1bGKerz1PTl5/arcgis/rest/services/Forest_Fire/FeatureServer/0',
    onEachFeature: function(feature, layer) {
        if (feature.properties && feature.properties.FireName) {
            var popupContent = `<b>Fire Name:</b> ${feature.properties.FireName}<br>` +
                               `<b>Fire Type:</b> ${feature.properties.FireType}<br>` +
                               `<b>Acres Burned:</b> ${feature.properties.Acres}`;
            layer.bindPopup(popupContent);
        }
    }
}).addTo(map);

// Fetching and adding GeoJSON data for boundaries
fetch('https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/USA_Boundaries_2022/FeatureServer/1/query?where=1=1&outFields=*&f=geojson')
.then(response => response.json())
.then(data => {
    L.geoJSON(data, {
        style: function (feature) {
            return {fill: false, color: 'black', weight: 2, opacity: 1};
        }
    }).addTo(map);

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = ["EOC Marker", "Fire Boundary", "Forest Fire"], // Labels for the legend
        labels = [];

    // Style for the legend items (e.g., larger text and symbols)
    div.style.padding = '6px 8px';
    div.style.font = '14px Arial, sans-serif';

    // Add a legend item with a larger color box for each grade
    labels.push('<i style="background:#FF6666; width: 18px; height: 18px; display: inline-block; margin-right: 5px;"></i> ' + grades[0]); // Color and label for EOC Marker
    labels.push('<i style="border: 2px solid black; width: 18px; height: 18px; display: inline-block; margin-right: 5px;"></i> ' + grades[1]); // Style and label for Forest Fire
    labels.push('<i style="background:#D80000; width: 18px; height: 18px; display: inline-block; margin-right: 5px;"></i> ' + grades[2]); // Color and label for Forest Fire

    div.innerHTML = labels.join('<br>');
    return div;
};

legend.addTo(map);

});
