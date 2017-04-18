angular.module('bikeApp').controller('BikeRacksCtrl', ['$scope', '$rootScope', '$log', 'BikeRacksService', BikeRacksCtrl]);

function BikeRacksCtrl($scope, $rootScope, $log, BikeRacksService){

  $scope.bikeRacksService = BikeRacksService;

  $scope.showBikeRacks = function () {
    if ($scope.bikeRacks.isChecked) {
      $scope.retrieveRacks();
    } else {
      //$scope.layers.overlays.bikeRacks.visible = false;
    }
  };

  $scope.bikeRacksRetrievalStatus = undefined;
  $scope.retrieveRacks = function (layerName) {
    var promiseRacksData = $scope.bikeRacksService.listRacks();
    promiseRacksData.then(
      function (response) {
        bikeRacksRetrievalStatus = undefined;
        if(angular.isDefined(response.data)){

          //$rootScope.markers = new Array();

          console.log("RACKS: "+JSON.stringify(response.data));

          angular.forEach(response.data, function(rack, rackId) {
            var rackObject = {
              //layer: layerName,
              lat: parseFloat(rack.latitude),
              lng: parseFloat(rack.longitude),
              draggable: false,
              message: "<b>Capacity:</b> " + rack.rack_capac + "<br> <b>Address:</b> " + rack.unitdesc,
              icon: {
                iconUrl: './img/bikeparking.png',

                iconSize:     [32, 32], // size of the icon
                iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
                popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
              }
            };
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
