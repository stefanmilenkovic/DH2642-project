

angular.module('bikeApp').factory('BikeIssueService', function ($http,$log) {

    var requestHeaders = {
        'x-apikey': '58dcea65f1d5e67930abe587',
        'accept': 'application/json; charset=utf-8',
        'content-type': 'application/json; charset=utf-8'
    };

    this.listIssues = function(query, issueType, bounds){

        var searchParams = {
            max: 1000,
            q: {},
            skip: 0
        };
        if(angular.isDefined(issueType) && issueType != "all"){
            searchParams.q["issue_type"] = issueType;
        }
        if(angular.isDefined(query) && query != ""){
            searchParams.q["message"] = {"$regex": query};
        }
        if(angular.isDefined(bounds)){
            searchParams.q["longitude"] = {};
            if(bounds.northEast.lng > bounds.southWest.lng){
                searchParams.q["longitude"]["$bt"] = [bounds.southWest.lng, bounds.northEast.lng];
            }
            else {
                searchParams.q["longitude"]["$bt"] = [bounds.northEast.lng, bounds.southWest.lng];
            }

            searchParams.q["latitude"] = {};
            if(bounds.northEast.lat > bounds.southWest.lat){
                searchParams.q["latitude"]["$bt"] = [bounds.southWest.lat, bounds.northEast.lat];
            }
            else {
                searchParams.q["latitude"]["$bt"] = [bounds.northEast.lat, bounds.southWest.lat];
            }
        }
        console.log("Search params: "+JSON.stringify(searchParams));

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

  /*  BikeIssueService.addNewIssue = function(issue){
        $http.post('https://bikereport-b1e1.restdb.io/rest/issues', issue, requestHeaders).then(
            function (response) {
                if (response.data)
                     $log.info("Post Data Submitted Successfully!");
             },
            function (response) {
                $log.info(response.statusText);
        }
        )};*/

    this.addNewIssue = function(issue) {

        var promise = $http({
            method: 'POST',
            url: 'https://bikereport-b1e1.restdb.io/rest/issues',
            headers: requestHeaders,
            data: issue
        });
        return promise;
    };

    return this;

});

