angular.module('bikeApp').directive('issueSearchInput', issueSearchInput);

function issueSearchInput() {
    var directive = {
        transclude: true,
        templateUrl: 'views/issue-search-input.html',
        restrict: 'EA'
    };
    return directive;

    function link(scope, element, attrs) {
        /* */
    }
};