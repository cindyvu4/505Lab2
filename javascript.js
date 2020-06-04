var mymap = L.map('mapid', {zoomControl:false}).setView([47.619, -122.32], 11);
var OpenStreetMap_Mapnik = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 18,
  id: 'mapbox.streets',
  accessToken: 'pk.eyJ1IjoiY2luZHl2dTQiLCJhIjoiY2sydzVleGJ3MGNkNDNpcW1odG1icDEwciJ9._9FHgo3Qa682z450P9Xz_w'
}).addTo(mymap);

//Creating a zoom control with Home option to return to main view
var zoomHome = L.Control.zoomHome();
zoomHome.addTo(mymap);

//Order of layers that go on the map.
mymap.createPane("neighborhoodsPane");
mymap.createPane("ParkPane");
mymap.createPane("BikeFacPane");
mymap.createPane("BikePane");

var layerControl = L.control.layers().addTo(mymap);

// load neighborhoods boundaries GeoJSON
$.getJSON("Neighborhoods.json",function(data){
	var Neighborhoods = L.geoJson(data, {
			pane: "neighborhoodsPane",
		style: function(feature) {
			return {
				color: "blue",
				fillOpacity: .2,
				weight: 1.5
			};
		},
		onEachFeature: function (feature, layer) {
            layer.bindPopup("<h4>Neighborhoods</h4>" + "Name: " + feature.properties.S_HOOD);
          }
				}).addTo(mymap);
        layerControl.addOverlay(Neighborhoods, "Neighborhoods");
});


// load parks boundaries GeoJSON
$.getJSON("Parks.json",function(data){
var parks =	L.geoJson(data, {
			pane: "ParkPane",
		style: function(feature) {
			return {
				color: "#006400",
				fillColor: "green",
				fillOpacity: 1,
				weight: .75
			};
		},
		onEachFeature: function (feature, layer) {
            layer.bindPopup("<h4>PARKS</h4>" + "NAME: " + feature.properties.NAME);
          }
				}).addTo(mymap);
        layerControl.addOverlay(parks, "Parks");
});

// load parks boundaries GeoJSON
$.getJSON("BikeFac.json",function(data){
	var bikeFac =	L.geoJson(data, {
			pane: "BikeFacPane",
		style: function(feature) {
			return {
				color: "black",
				weight: 1.5,
				dashArray: '10,25',
			};
		},
		onEachFeature: function (feature, layer) {
            layer.bindPopup("<h4>Bike Network</h4>" + "Name: " + feature.properties.STREET_NAM + '</br>' + "Length: " + feature.properties.LENGTH_MIL + '</br>' + "Network: " + feature.properties.NETWORK);
          }
				}).addTo(mymap);
        layerControl.addOverlay(bikeFac, "Bike Network");
});

$.getJSON("Bikes.json",function(data){
	var bikes = L.ExtraMarkers.icon({
		icon: "fas fa-bicycle",
		 markerColor: "blue",
		 shape: "circle",
	 });

	var bikestations = L.geoJson(data, {
			pointToLayer: function (feature, latlng){
					var marker = L.marker(latlng,{icon: bikes});
						marker.bindPopup("<b><h4>Bike Racks Locations</h4></b>" + " Address: " + feature.properties.UNITDESC + '</br>' + " Rack Capacity: " + feature.properties.RACK_CAPAC + '</br>' + " Conditions: " + feature.properties.CONDITION);
						return marker;
					}
				});
				var clusters = L.markerClusterGroup({
					showCoverageOnHover: false
				});
				clusters.addLayer(bikestations);
				mymap.addLayer(clusters);
        layerControl.addOverlay(clusters, "Bike Racks");
		});



		/*Legend specific*/
		var legend = L.control({ position: "bottomleft" });
		legend.onAdd = function(map) {
		  var div = L.DomUtil.create("div", "legend");
		  div.innerHTML += "<h4>Legend</h4>";
		  div.innerHTML += '<i style="background: blue"></i><span>Seattle Neighborhoods</span><br>';
		  div.innerHTML += '<i style="background: green"></i><span>Parks</span><br>';
		  div.innerHTML += '<i class="icon" style="background-image: url(https://d30y9cdsu7xlg0.cloudfront.net/png/194515-200.png);background-repeat: no-repeat;"></i><span>Bike Network (Roads)</span><br>';
			div.innerHTML += '<i class="icon: fas fa-bicycle";  background-repeat: no-repeat;"></i><span>Bike Racks</span><br>';

		  return div;
		};

		legend.addTo(mymap);
