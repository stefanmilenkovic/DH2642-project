'use strict';

/**
 * Route configuration for the RDash module.
 */
angular.module('bikeApp').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        // For unmatched routes
        $urlRouterProvider.otherwise('/');

        // Application routes
        $stateProvider
            .state('index', {
                url: '/',
                templateUrl: 'views/overview.html',
                controller: OverviewCtrl
            })
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'views/dashboard.html'
            })
            .state('tables', {
                url: '/tables',
                templateUrl: 'views/tables.html'
            });
    }
]);