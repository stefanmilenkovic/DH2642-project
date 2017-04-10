angular.module('bikeApp').controller('OverviewCtrl', ['$scope', '$rootScope','$cookieStore', '$timeout', 'BikeIssueService', OverviewCtrl]);

function OverviewCtrl($scope, $rootScope, $cookieStore, $timeout, BikeIssueService){

//    $scope.bikeIssueService = BikeIssueService;
    $scope.markers = new Array();

    $scope.issueTypes = [
        {id: 'all', name: 'All types'},
        {id: 'hazard', name: 'Hazard'},
        {id: 'pothole', name: 'Pothole'},
        {id: 'damage', name: 'Damage'},
        {id: 'theft', name: 'Theft'}
    ];

    $scope.issueFilter = {
        queryText: undefined,
        selectedType: $scope.issueTypes[0]
    };

    $scope.seattle = {
        lat: 47.60,
        lng: -122.33,
        zoom: 11
    };
    $scope.tiles = {
        url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        options: {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18
        }
    };
    $scope.defaults = {
        scrollWheelZoom: false
    };

    $scope.events = {};
  //$scope.markers = new Array();

   $scope.$on("leafletDirectiveMap.click", function(event, args){
        var leafEvent = args.leafletEvent;
        $scope.markers.push({
            lat: leafEvent.latlng.lat,
            lng: leafEvent.latlng.lng,
            draggable:true
        });
        console.log($scope.markers);
        $scope.showRightBar(leafEvent.latlng.lat, leafEvent.latlng.lng);
    });

   $rootScope.$on('deleteMarker',function(){
       $scope.markers.pop();

   });

    $scope.filterIssuesFromInput = function(){
        if ($scope.organisationsFilterTimeout){
            $timeout.cancel($scope.organisationsFilterTimeout);
        }

        $scope.organisationsFilterTimeout = $timeout(function() {
            console.log("Should filter from: "+JSON.stringify($scope.issueFilter));
            $scope.retrieveIssues();
        }, 250);
    };

    $scope.retrieveIssues = function () {
        var promiseIssueData = BikeIssueService.listIssues($scope.issueFilter.queryText, $scope.issueFilter.selectedType.id);
        promiseIssueData.then(
            function (response) {
                if(angular.isDefined(response.data)){

                    angular.forEach(response.data, function(issue, issueKey) {
                        console.log(issue);
                        var issueObject = {
                            lat: issue.latitude,
                            lng: issue.longitude,
                            message: issue.message,
                            draggable:false
                        };
                        $scope.markers.push(issueObject);
                    });
                }
            },
            function (response) {
                $scope.apiCallStatus = "Error :(";
                alert("Error: " + JSON.stringify(response));
            }
        );
    };

    $scope.retrieveIssues();
};
