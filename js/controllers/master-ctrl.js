/**
 * Master Controller
 */

angular.module('bikeApp').controller('MasterCtrl', ['$scope', '$cookieStore', MasterCtrl]);

function MasterCtrl($scope, $cookieStore) {

    $scope.issueFilter = {
        queryText: undefined
    };

    /**
     * Sidebar Toggle & Cookie Control
     */
    var mobileView = 992;

    $scope.getWidth = function() {
        return window.innerWidth;
    };

    $scope.$watch($scope.getWidth, function(newValue, oldValue) {
        if (newValue >= mobileView) {
            if (angular.isDefined($cookieStore.get('toggle'))) {
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


    $scope.setSelectedRightBarTab = function(rightBarTabKey){
        if(angular.isUndefined(rightBarTabKey)) return;
        $scope.rightBarSelected = rightBarTabKey;
    };
    $('.right-bar-toggle').on('click', function(e) {
        e.preventDefault();
        $('#wrapper').toggleClass('right-bar-enabled');
    });
}