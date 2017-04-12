

angular.module('bikeApp').factory('BikeIssueService', function ($http,$log) {

    var requestHeaders = {
        'x-apikey': '58dcea65f1d5e67930abe587',
        'accept': 'application/json; charset=utf-8',
        'content-type': 'application/json; charset=utf-8'
    };

    var BikeIssueService ={};
    BikeIssueService.listIssues = function(query, issueType){

        var searchParams = {
            max: 1000,
            q: {},
            skip: 0
        };
        if(angular.isDefined(issueType) && issueType != "all"){
            searchParams.q["issue_type"] = issueType;
        }
        if(angular.isDefined(query) && query != ""){
            searchParams.q["message"] = query;
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

    BikeIssueService.addNewIssue = function(issue) {
      var req = {
          method: 'POST',
          url: 'https://bikereport-b1e1.restdb.io/rest/issues',
          headers: requestHeaders,
          data : issue
      };

      $http(req).then(function (response) {
          $log.info("Post Data Submitted Successfully!");
      },
          function (response) {
              $log.info(response.statusText)
      }
      )};

    return BikeIssueService;

});

