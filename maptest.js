var app = angular.module("mobiliteitsapp", ["ngAnimate", "ngMaterial", "ui-leaflet"]);

//Controllers
app.controller("MainCtrl", ["$rootScope", "$scope", "$timeout", "$q", "$log", "locationService", function($rootScope, $scope, $timeout, $q, $log, locationService) {
  var self = this;
  self.simulateQuery = false;
  self.isDisabled = false;
  // list of `state` value/display objects
  self.locations = loadAll();
  self.querySearch = querySearch;
  self.selectedItemChange = selectedItemChange;
  self.searchTextChange = searchTextChange;
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
  function querySearch(query) {
    var results = query ? self.locations.filter(createFilterFor(query)) : self.locations,
      deferred;
    if (self.simulateQuery) {
      deferred = $q.defer();
      $timeout(function() {
        deferred.resolve(results);
      }, Math.random() * 1000, false);
      return deferred.promise;
    } else {
      return results;
    }
  }

  function searchTextChange(text) {
    $log.info("Text changed to " + text);
  }

  function selectedItemChange(item, id) {
    if (id === 1) {
      console.log("origin changed");
      $rootScope.$emit("originChanged", item);
    } else if (id === 2) {
      console.log("destination changed");
      $rootScope.$emit("destinationChanged", item);
    }
    $log.info("Item changed to " + JSON.stringify(item));
  }
  /**
   * Build `locations` list of key/value pairs
   */
  function loadAll() {
    var locations = locationService.getLocations();
    return locations.map(function(location) {
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

}]);
