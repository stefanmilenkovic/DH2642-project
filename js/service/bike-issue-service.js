

angular.module('bikeApp').factory('Dinner', function ($http, $cookieStore) {

    var requestHeaders = {
        'x-apikey': '58dcea65f1d5e67930abe587',
        "Accept": "application/json; charset=utf-8",
        "Content-Type": "application/json;charset=utf-8"
    };

    this.listIssues = function(issueType){
        var url = 'https://windpowerdata-8069.restdb.io/rest/benchmark';
        console.log("URL: "+url);
        var promise = $http({
            method: 'GET',
            url: url,
            params: {
                max: 1000,
                q: {},
                skip: 0,
                groupby: ["year", "month"],
                aggregate: ["SUM:wp1", "SUM:wp2", "SUM:wp3"]
            },
            headers: requestHeaders
        });

        return promise;
    };

    return this;

});