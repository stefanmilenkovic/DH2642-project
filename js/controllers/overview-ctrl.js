angular.module('bikeApp').controller('OverviewCtrl', ['$scope', '$rootScope','$cookieStore', '$timeout', 'BikeIssueService', OverviewCtrl]);

function OverviewCtrl($scope, $rootScope, $cookieStore, $timeout, BikeIssueService){

    $scope.bikeIssueService = BikeIssueService;
    $scope.expand_toggle = false;

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

    $rootScope.awesomeMarkerIcon_pothole = {
        type: 'awesomeMarker',
        icon: 'bicycle',
        markerColor: 'gray',
        prefix: 'fa'
    };
    $rootScope.awesomeMarkerIcon_hazard = {
        type: 'awesomeMarker',
        icon: 'bicycle',
        markerColor: 'red',
        prefix: 'fa'
    };
    $rootScope.awesomeMarkerIcon_damage = {
        type: 'awesomeMarker',
        icon: 'bicycle',
        markerColor: 'green',
        prefix: 'fa'
    };
    $rootScope.awesomeMarkerIcon_theft = {
        type: 'awesomeMarker',
        icon: 'bicycle',
        markerColor: 'orange',
        prefix: 'fa'
    };

    $scope.events = {};

   $scope.$on("leafletDirectiveMap.click", function(event, args){
        var leafEvent = args.leafletEvent;

        for(var i=0; i<$rootScope.markers.length; i++){
            if($rootScope.markers[i].in_progress == true){
                $rootScope.markers.splice(i, 1);
                i--;
            }
        }

        $rootScope.markers.push({
            lat: leafEvent.latlng.lat,
            lng: leafEvent.latlng.lng,
            in_progress: true,
            icon:{
                opacity: 0.5
            },
            label: {
                message: "Hey, add your comments in the form",
                options: {
                    noHide: true
                }
            }
        });
        $scope.showRightBar(leafEvent.latlng.lat, leafEvent.latlng.lng);
    });


   $rootScope.$on('deleteMarker',function(){
       $rootScope.markers.pop();
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

   $scope.$on("leafletDirectiveMarker.mouseover", function(event, args){
        var index = args.modelName;
        console.log(index);
       $scope.focusIndex = index;
        $scope.markers[index].opacity = 1;
    });

   $scope.$on("leafletDirectiveMarker.mouseout", function(event, args){
       var index = args.modelName;
        $scope.markers[index].opacity = 0.5;
    });

    $rootScope.buildMarkers = function (issues) {
        $rootScope.markers = new Array();

        angular.forEach(issues, function(issue, issueKey) {

            var issueObject = {
                lat: issue.latitude,
                lng: issue.longitude,
                message: issue.message,
                timestamp:issue.timestamp,
                issue_type:issue.issue_type,
                draggable:false,
                opacity: 0.5

            };
            if(issueObject.issue_type=="pothole"){
                issueObject.icon = $rootScope.awesomeMarkerIcon_pothole;
            }
            if(issueObject.issue_type=="hazard"){
                issueObject.icon = $rootScope.awesomeMarkerIcon_hazard;
            }
            if(issueObject.issue_type=="damage"){
                issueObject.icon = $rootScope.awesomeMarkerIcon_damage;
            }
            if(issueObject.issue_type=="theft"){
                issueObject.icon = $rootScope.awesomeMarkerIcon_theft;
            }

            $rootScope.markers.push(issueObject);
            console.log("Adding: "+JSON.stringify(issueObject));
        })
    };



    $scope.issueRetrievalStatus = undefined;
    $scope.retrieveIssues = function () {
        $scope.issueRetrievalStatus = "Filtering...";
        var promiseIssueData = $scope.bikeIssueService.listIssues($scope.issueFilter.queryText, $scope.issueFilter.selectedType.id);
        promiseIssueData.then(
            function (response) {
                $scope.issueRetrievalStatus = undefined;
                if(angular.isDefined(response.data)){
                    $rootScope.buildMarkers(response.data);
                }
            },
            function (response) {
                $scope.apiCallStatus = "Error :(";
                $scope.issueRetrievalStatus = "Error :(";
                alert("Error: " + JSON.stringify(response));
            }
        );
    };

    $scope.retrieveIssues();
};
