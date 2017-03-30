

angular.module('bikeApp').factory('BikeIssueService', function ($http, $cookieStore) {

    var requestHeaders = {
        'x-apikey': '58dcea65f1d5e67930abe587',
        "Accept": "application/json; charset=utf-8",
        "Content-Type": "application/json;charset=utf-8"
    };

    this.listIssuesByType = function(issueType){

        var searchParams = {
            max: 1000,
            q: {},
            skip: 0
        };
        if(angular.isDefined(issueType)){
            searchParams.q["issue_type"] = issueType;
        }

        var url = 'https://bikereport-b1e1.restdb.io/rest/issues';
        console.log("URL: "+url);
        var promise = $http({
            method: 'GET',
            url: url,
            params: searchParams,
            headers: requestHeaders
        });

        return promise;
    };

    return this;

});