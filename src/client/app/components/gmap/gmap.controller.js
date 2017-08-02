/*jshint esversion: 6*/
(function () {
    'use strict';

    angular
        .module('app.gmap', ['ngGeolocation'])
        .controller('GmapController', GmapController);
    //.directive('myMap', myApp);

    GmapController.$inject = ['logger', '$geolocation', '$scope'];
    /* @ngInject */
    function GmapController($geolocation, $scope) {
        var vm = this;
        vm.title = 'Gmap';




        initMap();

        function initMap() {

            // var myLatLng = { lat: 10.7681596, lng: 106.6943671 };

            // var map = new google.maps.Map(document.getElementById('map'), {
            //     zoom: 6,
            //     center: myLatLng
            // });

            //----------------------------------------------------------

            var infoWindow = new google.maps.InfoWindow;

            // Try HTML5 geolocation.
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    var map = new google.maps.Map(document.getElementById('map'), {
                        zoom: 15,
                        center: pos
                    }); 
                    // infoWindow.open(map);
                    // map.setCenter(pos);
                    // infoWindow.setPosition(pos);
                    // infoWindow.setContent('Location found.');
                    
                    var marker = new google.maps.Marker({
                        position: pos,
                        map: map,
                        title: 'Hello World!'
                    });

                    var customMapType = new google.maps.StyledMapType([
                        { stylers: [{ hue: '#D2E4C8' }] }, //color
                    ]);

                    var customMapTypeId = 'custom_style';
                    map.mapTypes.set(customMapTypeId, customMapType);
                    map.setMapTypeId(customMapTypeId);

                }, function () {
                    handleLocationError(true, infoWindow, map.getCenter());
                });
            } else {
                // Browser doesn't support Geolocation
                handleLocationError(false, infoWindow, map.getCenter());
            }
        };


        function handleLocationError(browserHasGeolocation, infoWindow, pos) {
            infoWindow.setPosition(pos);
            infoWindow.setContent(browserHasGeolocation ?
                'Error: The Geolocation service failed.' :
                'Error: Your browser doesn\'t support geolocation.');
            infoWindow.open(map);
        }
    }

})();

