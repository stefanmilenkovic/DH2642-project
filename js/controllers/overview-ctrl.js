angular.module('bikeApp').controller('OverviewCtrl', ['$scope', '$cookieStore', OverviewCtrl]);

function OverviewCtrl($scope, $cookieStore) {

    // http://tombatossals.github.io/angular-leaflet-directive/#!/examples/tiles
    $scope.seattle = {
        lat: 47.60,
        lng: -122.33,
        zoom: 13
    };
    $scope.tiles = {
        url: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        options:{
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            minZoom: 5
        }
    };
    $scope.defaults = {
        scrollWheelZoom: false
    };

    $scope.plotMap = function () {

        var mymap = L.map('mapid').setView([47.60, -122.33], 13);

        var southWest = L.latLng(45.60, -118.33),
            northEast = L.latLng(49.60, -126.83),
            bounds = L.latLngBounds(southWest, northEast);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            minZoom: 5,
            maxBounds: bounds
        }).addTo(mymap);

        var marker = L.marker();
        var popupContent = '<form id="report-form" class ="form-horizontal">' +
            '<div class="form-group">' +
            '<label class="control-label col-md-5"><strong>Report Here</strong></label>' +
            '</div>' +
            '<div class="form-group">' +
            '<textarea rows="3" cols="30" placeholder="Required" id="report" name="report" class="form-control col-md-10"></textarea>' +
            '</div>' +
            '<div class="form-group">' +
            '<div style="text-align:center;" class="col-md-4"><button type="button" class="btn">Cancel</button></div>' +
            '<div style="text-align:center;" class="col-md-4"><button type="submit" value="submit" class="btn btn-primary trigger-submit">Submit</button></div>' +
            '</div>' +
            '</form>';

        function onMapClick(e) {
            marker.setLatLng(e.latlng).addTo(mymap);
            marker.bindPopup(popupContent, {
                keepInView: true,
                closeButton: false,
                maxWidth: 500
            }).openPopup();
        }

        mymap.on('click', onMapClick);
    };

    //$scope.createMap();

};