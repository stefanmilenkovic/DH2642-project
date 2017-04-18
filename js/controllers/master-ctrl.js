/**
 * Master Controller
 */

angular.module('bikeApp').controller("MasterCtrl",['$scope','$rootScope','$timeout','BikeIssueService','$cookieStore', function ($scope, $rootScope, $timeout, BikeIssueService, $cookieStore) {

    /**
     * Sidebar Toggle & Cookie Control
     */
    var mobileView = 992;
    var previousIndex = -1;

    $rootScope.markers = new Array();

    $scope.getWidth = function() {
        return window.innerWidth;
    };

    $scope.$watch($scope.getWidth, function(newValue, oldValue) {
        if (newValue >= mobileView) {
            if (angular.isDefined($cookieStore.get("toggle"))) {
                $scope.toggle = ! $cookieStore.get('toggle') ? false : true;
            } else {
                $scope.toggle = true;
            }
        } else {
            $scope.toggle = false;
        }
    });

    $scope.toggleSidebar = function() {
        $scope.toggle = !$scope.toggle;
        $cookieStore.put('toggle', $scope.toggle);
    };

    window.onresize = function() {
        $scope.$apply();
    };

    $scope.rightBarSelected = "activity";
    $scope.rightBarTabsDefault = [$scope.rightBarSelected];

    $scope.rightBarReset = function(skipSettingDefaultTag){
        $scope.rightBarTabs = new Array();
        Array.prototype.push.apply($scope.rightBarTabs, $scope.rightBarTabsDefault);
        if(skipSettingDefaultTag === true)
            return;
        $scope.setSelectedRightBarTab("activity");
    };

    $scope.rightBarTabVisible = function(tabKey){
        if(angular.isDefined(tabKey) && $scope.rightBarTabs.indexOf(tabKey.toLowerCase()) != -1)
            return true;
        return false;
    };

    $scope.isRightBarVisible = false;

    $scope.resetAndToggleRightBar = function(newState){
        $scope.rightBarReset();
        $scope.toggleRightBar(newState);
    };

    $scope.toggleRightBar = function(newState){
        if(angular.isDefined(newState)){
            $scope.isRightBarVisible = newState;
            $('#content-wrapper').toggleClass('right-bar-enabled', newState);
        }
        else{
            $scope.isRightBarVisible = !$scope.isRightBarVisible;
            $('#content-wrapper').toggleClass('right-bar-enabled');
        }
    };

    $scope.showRightBar = function (lat, lng) {
        $scope.isRightBarVisible = true;
        $('#content-wrapper').toggleClass('right-bar-enabled', true);
        $scope.lat = lat;
        $scope.lng = lng;
    };

    $scope.hideRightBar = function () {
        $scope.isRightBarVisible = false;
        $('#content-wrapper').toggleClass('right-bar-enabled', false);
        $scope.typeOfIssue="";
        $scope.describe="";
        $scope.issueRegister.$pristine = true;
        $scope.issueRegister.$submitted = false;
        $scope.$emit('deleteMarker');
    };

    $('.right-bar-toggle').on('click', function(e) {
        e.preventDefault();
        $('#wrapper').toggleClass('right-bar-enabled');
    });

    $scope.toggleExpanded = function (item, presentIndex) {
        console.log("I am clicked "+presentIndex);
        if(previousIndex == -1) {
            previousIndex = presentIndex;
        }else if(previousIndex != presentIndex){
            $rootScope.markers[previousIndex].opacity =0.5;
            //$rootScope.markers[presentIndex].focus = true;
            previousIndex = presentIndex;
        }
        $rootScope.markers[presentIndex].opacity = 1;
        if (angular.isUndefined(item.expanded)) {
                item.expanded = true;
              //  $rootScope.markers[presentIndex].focus = true;
            }
        else{
            item.expanded = !item.expanded;
           // $rootScope.markers[presentIndex].focus = true;

        }
    };

    $scope.highLight = function (presentIndex) {
        if(previousIndex == -1) {
            previousIndex = presentIndex;
        }else if(previousIndex != presentIndex){
            $rootScope.markers[previousIndex].opacity =0.5;
            previousIndex = presentIndex;
        }
        $rootScope.markers[presentIndex].opacity = 1;
    };

    $scope.createIssue = function(valid){
        if(valid){
            $scope.issueRetrievalStatus = "Creating...";
            var d = new Date();
            var n = d.getTime();
            var issue = {
                issue_type: $scope.typeOfIssue,
                latitude: $scope.lat,
                longitude: $scope.lng,
                message: $scope.describe,
                timestamp: n
            };
            var promiseData = BikeIssueService.addNewIssue(issue);
            promiseData.then(
                function (successResponse) {

                    var issueObject = {
                        lat: issue.latitude,
                        lng: issue.longitude,
                        message: issue.message,
                        issue_type:issue.issue_type,
                        draggable:false
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
                   // console.log("Before pushing: "+JSON.stringify(issueObject));

                    $rootScope.markers.splice(($rootScope.markers.length - 1), 1);

                    $timeout(function() {
                        $rootScope.markers.push(issueObject);
                    }, 50);

                    $scope.issueRetrievalStatus = undefined;
                    hideRightBarWhenSubmit();
                },
                function (errorResponse) {
                    $scope.issueRetrievalStatus = "Error :(";
                    hideRightBarWhenSubmit();
                }
            );
        }
        else{
            console.log("Invalid Form");
        }
    };

    var hideRightBarWhenSubmit = function () {
        $scope.isRightBarVisible = false;
        $('#content-wrapper').toggleClass('right-bar-enabled', false);
        $scope.typeOfIssue="";
        $scope.describe="";
        $scope.issueRegister.$pristine = true;
        $scope.issueRegister.$submitted = false;
    };


}]);
