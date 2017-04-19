angular.module('bikeApp').controller('OverviewCtrl', ['$scope', '$rootScope', '$cookieStore', '$timeout', '$controller',
    'leafletBoundsHelpers', 'BikeIssueService', OverviewCtrl]);

function OverviewCtrl($scope, $rootScope, $cookieStore, $timeout, $controller, leafletBoundsHelpers, BikeIssueService){

  angular.extend(this, $controller('BikeRacksCtrl', {$scope: $scope}));

  $scope.bikeIssueService = BikeIssueService;
  $scope.expand_toggle = false;

    $scope.seattle = {
        lat: 47.60,
        lng: -122.33,
        zoom: 11
    };
    //Setting values from cookie store
    if(angular.isDefined($cookieStore.get('centerLat'))){
        $scope.seattle["lat"] = parseFloat($cookieStore.get('centerLat'));
    }
    if(angular.isDefined($cookieStore.get('centerLng'))){
        $scope.seattle["lng"] = parseFloat($cookieStore.get('centerLng'));
    }
    if(angular.isDefined($cookieStore.get('userZoom'))){
        $scope.seattle["zoom"] = parseFloat($cookieStore.get('userZoom'));
    }

    //Setting filter from cookies if present
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
    if(angular.isDefined($cookieStore.get('issueFilterText'))){
        $scope.issueFilter.queryText = $cookieStore.get('issueFilterText');
    }
    if(angular.isDefined($cookieStore.get('issueFilterType'))){
        $scope.issueFilter.selectedType = $cookieStore.get('issueFilterType');
    }

    $scope.bounds = leafletBoundsHelpers.createBoundsFromArray([
        [ 47.77532914630374, -122.86628723144531 ],
        [ 47.47823216312885, -121.79374694824219 ]
    ]);

    $scope.tiles = {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      options: {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://mapbox.com">Mapbox</a>',
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
    //$scope.markers = new Array();

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
        $cookieStore.put('issueFilterText', $scope.issueFilter.queryText);
        $cookieStore.put('issueFilterType', $scope.issueFilter.selectedType);
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

    $rootScope.buildMarkers = function () {
        $rootScope.markers = new Array();

        console.log("Should build markers for " + $rootScope.issues.length);

        /* Build markers for issues */
        angular.forEach($rootScope.issues, function (issue, issueKey) {

            var issueObject = {
                lat: issue.latitude,
                lng: issue.longitude,
                message: issue.message,
                timestamp: issue.timestamp,
                issue_type: issue.issue_type,
                draggable: false,
                opacity: 0.5

            };
            if (issueObject.issue_type == "pothole") {
                issueObject.icon = $rootScope.awesomeMarkerIcon_pothole;
            }
            if (issueObject.issue_type == "hazard") {
                issueObject.icon = $rootScope.awesomeMarkerIcon_hazard;
            }
            if (issueObject.issue_type == "damage") {
                issueObject.icon = $rootScope.awesomeMarkerIcon_damage;
            }
            if (issueObject.issue_type == "theft") {
                issueObject.icon = $rootScope.awesomeMarkerIcon_theft;
            }
            $rootScope.markers.push(issueObject);
        });

        if($rootScope.bikeRacksCheckbox.checked && $scope.seattle.zoom >= 15) {
            angular.forEach($rootScope.bikeRacks, function (rack, rackId) {
                //Check if this bike racks is between bounds of the current map view
                if($scope.isBetweenLengths(rack.latitude, $scope.bounds.southWest.lat, $scope.bounds.northEast.lat) &&
                        $scope.isBetweenLengths(rack.longitude, $scope.bounds.southWest.lng, $scope.bounds.northEast.lng)) {
                    var rackObject = {
                        //layer: layerName,
                        lat: parseFloat(rack.latitude),
                        lng: parseFloat(rack.longitude),
                        draggable: false,
                        message: "<b>Capacity:</b> " + rack.rack_capac + "<br> <b>Address:</b> " + rack.unitdesc,
                        icon: {
                            iconUrl: './img/bikeparking.png',
                            iconSize: [32, 32], // size of the icon
                            iconAnchor: [0, 0], // point of the icon which will correspond to marker's location
                            popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
                        }
                    };
                    $rootScope.markers.push(rackObject);
                }
            });
        }

        $scope.$emit('markerArrayLength', $rootScope.markers.length);
    };

    $scope.isBetweenLengths = function (lengthToCompare, length1, lenght2) {
        if(length1 <= lenght2 && lengthToCompare >= length1 && lengthToCompare <= lenght2){
            return true;
        }
        else if(length1 > lenght2 && lengthToCompare <= length1 && lengthToCompare >= lenght2){
            return true;
        }
        return false;
    };

    $scope.$on('leafletDirectiveMap.zoomend', function(event){
        if ($scope.filterTimeout){
            $timeout.cancel($scope.filterTimeout);
        }

        $scope.filterTimeout = $timeout(function() {
            $cookieStore.put('userZoom', $scope.seattle.zoom);
            $scope.retrieveIssues();
          //$scope.testAddCorners();
        }, 100);
    });

    $scope.$on('leafletDirectiveMap.dragend', function(event){
        $timeout(function() {
            $cookieStore.put('centerLat', $scope.seattle.lat);
            $cookieStore.put('centerLng', $scope.seattle.lng);
            $scope.retrieveIssues();
            //$scope.testAddCorners();
        }, 100);
    });

    $scope.counter = 1;
    $scope.testAddCorners = function () {
        var issueObject1 = {
            lat: $scope.bounds.southWest.lat,
            lng: $scope.bounds.southWest.lng,
            message: "corner: "+$scope.counter+" -> lat: "+$scope.bounds.southWest.lat+" -> lng: "+$scope.bounds.southWest.lng,
            draggable:false
        };
        issueObject1.icon = $rootScope.awesomeMarkerIcon_pothole;

        var issueObject2 = {
            lat: $scope.bounds.northEast.lat,
            lng: $scope.bounds.northEast.lng,
            message: "corner: "+$scope.counter+" -> lat: "+$scope.bounds.northEast.lat+" -> lng: "+$scope.bounds.northEast.lng,
            draggable:false
        };
        issueObject2.icon = $rootScope.awesomeMarkerIcon_pothole;

        $scope.counter++;

        $timeout(function() {
          console.log("Adddinggg......");
            $rootScope.markers.push(issueObject1);
            $rootScope.markers.push(issueObject2);
        }, 50);
    };


    $scope.issueRetrievalStatus = undefined;
    $scope.issueRetrievalTimeout = undefined;
    $scope.retrieveIssues = function () {

      if ($scope.issueRetrievalTimeout){
        console.log("Canceling reatrieval...");
          $timeout.cancel($scope.issueRetrievalTimeout);
      }

      $scope.issueRetrievalTimeout = $timeout(function() {
        $rootScope.issues = [];
        $scope.issueRetrievalStatus = "Filtering...";
        var promiseIssueData = $scope.bikeIssueService.listIssues($scope.issueFilter.queryText, $scope.issueFilter.selectedType.id, $scope.bounds);
        promiseIssueData.then(
            function (response) {
                $scope.issueRetrievalStatus = undefined;
                $rootScope.issues = response.data;
                $rootScope.buildMarkers();
            },
            function (response) {
                $scope.apiCallStatus = "Error :(";
                $scope.issueRetrievalStatus = "Error on retrieval of issues :(";
                console.error("Error: " + JSON.stringify(response));
                //alert("Error: " + JSON.stringify(response));
            }
        );
      }, 300);
    };

    $scope.retrieveIssues();
};
