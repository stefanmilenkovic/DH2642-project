angular.module('bikeApp').controller('SidebarCtrl', ['$scope', '$rootScope', '$cookieStore', '$timeout', '$controller',
    'leafletBoundsHelpers', 'BikeIssueService', SidebarCtrl]);

function SidebarCtrl($scope, $rootScope, $cookieStore, $timeout, $controller, leafletBoundsHelpers, BikeIssueService){

    $scope.filterMarkersForIssues = function (marker) {
        console.log("Checking: "+JSON.stringify(marker));
        return marker.issue_type !== undefined;
    };
};
