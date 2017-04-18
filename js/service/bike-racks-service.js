angular.module('bikeApp').factory('BikeRacksService', function ($http,$log) {

    var requestHeaders = {
        'X-App-Token': 'XUYwogYaPvb0aVfX90Rdl4Nls',
        'accept': 'application/json; charset=utf-8',
        'content-type': 'application/json; charset=utf-8'
    };

    var BikeRacksService ={};
    BikeRacksService.listRacks = function(){

              var searchParams = "?$select=latitude,longitude,rack_capac,unitdesc";

              var url = 'https://data.seattle.gov/resource/fxh3-tqdm.json' + searchParams;
              var promise = $http({
                  method: 'GET',
                  url: url,
                  headers: requestHeaders
              });

              return promise;
          };

    return BikeRacksService;

});
