angular.module("mobiliteitsapp").controller("MapCtrl", ["$rootScope", "$scope", "locationService", function($rootScope, $scope, locationService) {
  var self = this;
  var _console = $("#console");
  var clear = $("#clear");
  var map = L.map("map").setView([51.0328, 3.7384], 14);
  var route = [];
  var visualRoute;
  var fietsRoute = drawRoute(storedRoutes[0].PJ2SchoolByBike, "green");
  var busRoute = drawRoute(storedRoutes[1].PJ2SchoolByBus);
  var routes = {
    "Fiets": fietsRoute,
    "Bus": busRoute
  };
  var locations = locationService.getLocations();
  var destination = "";
  var origin = "";
  var routeLayer;
  var thuis = L.marker([storedLocations[0].lat, storedLocations[0].lng]).addTo(map);
  var stage = L.marker([storedLocations[1].lat, storedLocations[1].lng]).addTo(map);
  var school = L.marker([storedLocations[2].lat, storedLocations[2].lng]).addTo(map);
  var featureGroup = new L.FeatureGroup();
  map.addLayer(featureGroup);
  addPopup(thuis, storedLocations[0]);
  addPopup(stage, storedLocations[1]);
  addPopup(school, storedLocations[2]);

  $rootScope.$on("originChanged", function(event, item) {
    console.log("on originChanged was called");
    for (var i = 0; i < locations.length; i++) {
      if (locations[i].name === item) {
        console.log("changing origin var to: " + item);
        origin = item;
        break;
      }
    }
    updateRoute();
  });

  $rootScope.$on("destinationChanged", function(event, item) {
    console.log("on destinationChanged was called");
    for (var i = 0; i < locations.length; i++) {
      if (locations[i].name === item) {
        console.log("changing destination var to: " + item);
        destination = item;
        break;
      }
    }
    updateRoute();
  });

  L.control.layers(null, routes).addTo(map);

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

  function updateRoute() {
    console.log("updating routes");
    featureGroup.clearLayers();
    featureGroup.addLayer(drawRoute(storedRoutes[0].PJ2SchoolByBike, "green"));
    featureGroup.addLayer(drawRoute(storedRoutes[1].PJ2SchoolByBus, "red"));

  }

  function drawRoute(route, color) {
    var routeDrawing = new L.LayerGroup();
    L.polyline(route, {
      color: color === undefined ? "red" : color
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

  function addPopup(marker, location) {
    var container = $("<div />");
    container.on("click", ".origin", function() {
      origin = location;
      console.log("set origin: " + location.name);
      updateRoute();
    });
    container.on("click", ".destination", function() {
      destination = location;
      console.log("set destination: " + location.name);
      updateRoute();
    });
    container.html("<a href='#' class='origin'>Set origin</a>.<br/>" +
      "<a href='#' class='destination'>Set destination</a>."
    );
    marker.bindPopup(container[0]);
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

}]);

angular.module("mobiliteitsapp").service("locationService", function() {
  var locations = storedLocations;

  if (typeof(Storage) !== "undefined") {
    console.log("Storage available");
  } else {
    console.log("No storage available");
  }

  //localStorage.removeItem("locations");
  //localStorage.setItem("locations", JSON.stringify(locations));

  var addLocation = function(loc) {
    locations.push(loc);
  };

  var getLocations = function() {
    return locations;
  };

  return {
    addLocation: addLocation,
    getLocations: getLocations
  };

});
