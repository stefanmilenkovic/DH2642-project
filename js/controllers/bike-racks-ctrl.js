angular.module('bikeApp').controller('BikeRacksCtrl', ['$scope', '$rootScope', '$log','$cookieStore', 'BikeRacksService', BikeRacksCtrl]);

function BikeRacksCtrl($scope, $rootScope, $log, $cookieStore, BikeRacksService){

  $scope.bikeRacksService = BikeRacksService;

  $scope.showBikeRacks = function () {
    $rootScope.buildMarkers();
    $cookieStore.put('showBikeRacks', $rootScope.bikeRacksCheckbox.checked);
  };

  $scope.bikeRacksRetrievalStatus = undefined;
  $scope.retrieveRacks = function (layerName) {
    $scope.bikeRacksRetrievalStatus = "Retrieving bike racks data";
    $rootScope.bikeRacks = [];
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
        $scope.apiCallStatus = "Error on retrieval of bike racks :(";
        console.error("Error: " + JSON.stringify(response));
      }
    );
  };

  $scope.retrieveRacks();
};
