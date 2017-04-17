angular.module('bikeApp').controller('bikeRacksCtrl', ['$scope', '$rootScope', '$log', 'BikeRacksService', bikeRacksCtrl]);

function bikeRacksCtrl($scope, $rootScope, $log, BikeRacksService){

  $scope.bikeRacksService = BikeRacksService;

  $scope.bikeParkingIcon = L.icon({
    iconUrl: './img/bikeparking.png',

    iconSize:     [32, 32], // size of the icon
    iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
  });

  $rootScope.$on("loadBikeRacksLayer", function(){
    $log.log("Retrieving bike racks")
    $scope.retrieveRacks();
  });

  $scope.bikeRacksRetrievalStatus = undefined;
  $scope.retrieveRacks = function () {
    var promiseRacksData = $scope.bikeRacksService.listRacks();
    promiseRacksData.then(
      function (response) {
        bikeRacksRetrievalStatus = undefined;
        if(angular.isDefined(response.data)){

          $rootScope.markers = new Array();

          angular.forEach(response.data, function(rack, rackId) {
            var rackObject = {
              layer:"Bike racks",
              lat: parseFloat(rack.latitude),
              lng: parseFloat(rack.longitude),
              draggable: false,
              message: "<b>Capacity:</b> " + rack.rack_capac + "<br> <b>Address:</b> " + rack.unitdesc
            };
            rackObject.icon = $scope.bikeParkingIcon;
            $rootScope.markers.push(rackObject);
          });
          $scope.$emit('markerArrayLength', $rootScope.markers.length);
        }
      },
      function (response) {
        $scope.apiCallStatus = "Error";
        $log.error("Error: " + JSON.stringify(response));
      }
    );
  };
};
