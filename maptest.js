var app = angular.module('mobiliteitsapp', ['ngAnimate', 'ngMaterial']);

//Controllers
app.controller('MainCtrl', function($timeout, $q, $log){
  var self = this;
    self.simulateQuery = false;
    self.isDisabled    = false;
    // list of `state` value/display objects
    self.locations        = loadAll();
    self.querySearch   = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange   = searchTextChange;
    self.newState = newState;

    function newState() {
      $log("test");
    }
    // ******************************
    // Internal methods
    // ******************************
    /**
     * Search for locations... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch (query) {
      var results = query ? self.locations.filter( createFilterFor(query) ) : self.locations,
          deferred;
      if (self.simulateQuery) {
        deferred = $q.defer();
        $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
        return deferred.promise;
      } else {
        return results;
      }
    }
    function searchTextChange(text) {
      $log.info('Text changed to ' + text);
    }
    function selectedItemChange(item) {
      $log.info('Item changed to ' + JSON.stringify(item));
    }
    /**
     * Build `locations` list of key/value pairs
     */
    function loadAll() {
      var locations = [
        {
          'name': 'kot',
          'adres': 'Nonnemeersstraat 21'
        },
        {
          'name': 'werk',
          'adres': 'Sint-Salvatorstraat 18'
        },
        {
          'name': 'café',
          'adres': 'Bierweg 34'
        },
        {
          'name': 'campus Schoonmeersen',
          'adres': 'schoolstraat 1'
        },
        {
          'name': 'campus Mercator',
          'adres': 'schoolstraat 2'
        }
      ];
      return locations.map( function (location) {
        location.value = location.name.toLowerCase();

        return location;
      });
    }
    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(state) {
        return (state.value.indexOf(lowercaseQuery) === 0);
      };
    }
});

var map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoicGlldGVyamFudiIsImEiOiJjaWtudXNjdW4wdHZudnRrbTlmMm93Z2k4In0.hLkiI0rXfp8IPGrzVO1cIQ'
}).addTo(map);

/*L.tileLayer('http://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
*/
