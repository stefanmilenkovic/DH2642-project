angular.module('bikeApp').controller('BikeRacksCtrl', ['$scope', '$rootScope', '$log', 'BikeRacksService', BikeRacksCtrl]);

function BikeRacksCtrl($scope, $rootScope, $log, BikeRacksService){

  $scope.bikeRacksService = BikeRacksService;

  $scope.showBikeRacks = function () {
    $rootScope.buildMarkers();
  };

  $scope.bikeRacksRetrievalStatus = undefined;
  $scope.retrieveRacks = function (layerName) {
    var promiseRacksData = $scope.bikeRacksService.listRacks();
    promiseRacksData.then(
      function (response) {
        $scope.bikeRacksRetrievalStatus = undefined;
        if(angular.isDefined(response.data)){
          $rootScope.bikeRacks = response.data;
        }
      },
      function (response) {
        $scope.bikeRacksRetrievalStatus = undefined;
        $scope.apiCallStatus = "Error";
        $log.error("Error: " + JSON.stringify(response));
      }
    );
  };

  $scope.retrieveRacks();
};
