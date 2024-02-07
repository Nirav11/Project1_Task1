## Interactive Web Map with Leaflet
This project demonstrates the use of Leaflet to create an interactive web map that displays various layers, including base maps, marker clusters for local emergency operations centers, burn severity polygons, and USA state boundaries. Data is dynamically loaded from external sources and represented on the map with customized styles and popups.

## Features
Base Map: Utilizes OpenStreetMap tiles as the base layer.
Local Emergency Operations Centers: Displays markers clustered for efficiency and scalability. Data fetched from an ArcGIS service.
Burn Severity: Shows polygons representing areas affected by fires, including details like fire name, type, and acres burned. Data fetched from an ArcGIS service.
USA State Boundaries: Outlines state boundaries within the USA. Data fetched from an ArcGIS service.

## Usage
The map shows the Forest Fire at different time period along with the Emergency Response Centre overlayed over the United States Boundary.

Dependencies
Leaflet: For mapping functionalities.
Leaflet.markercluster: For clustering markers efficiently.
Esri-leaflet: To load and display data from ArcGIS services.
