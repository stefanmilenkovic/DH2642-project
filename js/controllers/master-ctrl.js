/**
 * Master Controller
 */

angular.module('bikeApp').controller("MasterCtrl",['$scope','$rootScope','BikeIssueService','$cookieStore', function ($scope, $rootScope, BikeIssueService, $cookieStore) {

    /**
     * Sidebar Toggle & Cookie Control
     */
    var mobileView = 992;

    $scope.$on('markerArrayLength', function(events, args) {
        $scope.commentToggle = new Array($rootScope.markers.length);
        console.log($scope.commentToggle.length);
    });

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

    var hideRightBarWhenSubmit = function () {
        $scope.isRightBarVisible = false;
        $('#content-wrapper').toggleClass('right-bar-enabled', false);
        $scope.typeOfIssue="";
        $scope.describe="";
        $scope.issueRegister.$pristine = true;
        $scope.issueRegister.$submitted = false;
    };

    $('.right-bar-toggle').on('click', function(e) {
        e.preventDefault();
        $('#wrapper').toggleClass('right-bar-enabled');
    });

    $scope.go= function(index){
        if($scope.commentToggle[index] == true)
            for(var i=0; i<$scope.commentToggle.length;i++){
                if(i == index)
                    $scope.commentToggle[index] = false;
                else
                    $scope.commentToggle[i] = true;
            }
        else
            for (var i=0; i<$scope.commentToggle.length;i++) {
                if (i == index)
                    $scope.commentToggle[index] = true;
                else
                    $scope.commentToggle[i] = false;
            }
    };

    $scope.createIssue = function(valid){
        if(valid){
            var d = new Date();
            var n = d.getTime();
            var issue = {
                issue_type: $scope.typeOfIssue,
                latitude: $scope.lat,
                longitude: $scope.lng,
                message: $scope.describe,
                timestamp: n
            };
            BikeIssueService.addNewIssue(issue);
            hideRightBarWhenSubmit();
        }
        else{
            console.log("Invalid Form");
        }
    };

}]);
