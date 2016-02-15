$(function() {
  var _console = $("#console");
  var clear = $("#clear");
  var map = L.map("map").setView([51.0328, 3.7384], 14);
  var route = [];
  var visualRoute;
  var fietsRoute = drawRoute(storedRoutes[0].PJ2SchoolByBike);
  var busRoute = drawRoute(storedRoutes[1].PJ2SchoolByBus);
  var routes = {
    "Fiets": fietsRoute,
    "Bus": busRoute
  };

  L.control.layers(routes).addTo(map);

  map.on("click", onMapClick);

  map.on("baselayerchange", function(e) {
    for (var key in e.layer._layers) {
      if (e.layer._layers[key].hasOwnProperty("_latlngs")) {
        map.fitBounds(e.layer._layers[key]);
        break;
      }
    }
  });

  clear.on("click", clearRoute);

  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> " +
      "contributors,<a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>," +
      "Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: "pk.eyJ1IjoicGlldGVyamFudiIsImEiOiJjaWtudX" +
      "NjdW4wdHZudnRrbTlmMm93Z2k4In0.hLkiI0rXfp8IPGrzVO1cIQ"
  }).addTo(map);



  function drawRoute(route) {
    var routeDrawing = new L.LayerGroup();
    L.polyline(route, {
      color: "red"
    }).addTo(routeDrawing);
    //map.fitBounds(polyline.getBounds());
    L.marker([route[0].lat, route[0].lng]).addTo(routeDrawing);
    L.marker([route[route.length - 1].lat, route[route.length - 1].lng]).addTo(routeDrawing);
    return routeDrawing;
  }

  function log(message) {
    _console.append(message + "<br/>");
  }

  function clearConsole() {
    _console.text("");
  }

  function onMapClick(e) {
    //log("You clicked the map at " + e.latlng);
    //alert("You clicked the map at " + e.latlng);
    addToRoute(e.latlng);
    clearConsole();
    logRoute(route);
    if (route.length > 1) {
      showRoute();
    }
  }

  function clearRoute() {
    route = [];
    if (visualRoute !== undefined) {
      map.removeLayer(visualRoute);
    }
    visualRoute = undefined;
    clearConsole();
  }

  function logRoute(route) {
    var json = "[";
    for (var i = 0; i < route.length; i++) {
      if (i > 0) {
        json = json.concat(",");
      }
      json = json.concat("{\"lat\":" + route[i].lat + ",\"lng\":" + route[i].lng + "}");
    }
    json = json.concat("]");
    log(json);
  }

  function addToRoute(latlng) {
    route.push(latlng);
  }

  function showRoute() {
    if (visualRoute !== undefined) {
      map.removeLayer(visualRoute);
    }
    visualRoute = L.polyline(route, {
      color: "red"
    }).addTo(map);
  }

  if (typeof(Storage) !== "undefined") {
    console.log("Storage available");
  } else {
    console.log("No storage available");
  }

  var locations = [{
    "name": "Kot",
    "address": "Kotstraat 11",
    "lat": 51.05426,
    "lng": 3.72196
  }, {
    "name": "Cafe",
    "address": "Cafestraat 25",
    "lat": 51.05355,
    "lng": 3.72454
  }, {
    "name": "School",
    "address": "Schoolstraat 58",
    "lat": 51.05304,
    "lng": 3.72612
  }, {
    "name": "Thuis",
    "address": "Thuisstraat 23",
    "lat": 51.05252,
    "lng": 3.72737
  }];

  localStorage.removeItem("locations");
  localStorage.setItem("locations", JSON.stringify(locations));

  function logLocations(locations) {
    var json = "[";
    for (var i = 0; i < locations.length; i++) {
      if (i > 0) {
        json = json.concat(",");
      }
      json = json.concat(
        "{\"name\":" + locations[i].name + ",\"address\":" +
        locations[i].address + ",\"lat\":" + locations[i].lat +
        ",\"lng\":" + locations[i].lng + "}"
      );
    }
    json = json.concat("]");
    log(json);
  }

  logLocations(JSON.parse(localStorage.locations));

});

/*L.tileLayer("http://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png", {
    attribution: "&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors"
  }).addTo(map);
*/

/*$.ajax({
  url: "./routes.json",
  success: function(data) {
    routes = JSON.parse(data);
  }
});*/

/*
var draggableMarker = L.marker(new L.LatLng(51.0500, 3.7333), {
  draggable: true
});

draggableMarker.bindPopup("This marker is draggable! Move it around.");
draggableMarker.addTo(map);
draggableMarker.on("dragend", function(event) {
  //todo
});
*/
