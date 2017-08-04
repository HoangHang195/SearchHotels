/*jshint esversion: 6*/
(function () {
    'use strict';

    angular
        .module('app.gmap', ['ngGeolocation', 'infinite-scroll'])
        .controller('GmapController', GmapController);
    //.directive('myMap', myApp);

    GmapController.$inject = ['logger', '$geolocation', '$scope'];
    /* @ngInject */
    function GmapController($geolocation, $scope) {

        var vm = this;
        vm.title = 'Gmap';
        vm.codeAddress = codeAddress;

        //google.maps.event.addDomListener(window, 'load', initMap);

        initMap();
        // codeAddress();
        // zoomControl();

        var map, infoWindow, geocoder;
        function initMap() {
            map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: 10.8482599, lng: 106.7841407 },
                zoom: 15
            });
            infoWindow = new google.maps.InfoWindow;

            // Try HTML5 geolocation.
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    infoWindow.setPosition(pos);
                    infoWindow.setContent('Đây là vị trí hiện tại của bạn.');
                    infoWindow.open(map);
                    map.setCenter(pos);
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
        }

        function handleLocationError(browserHasGeolocation, infoWindow, pos) {
            infoWindow.setPosition(pos);
            infoWindow.setContent(browserHasGeolocation ?
                'Error: The Geolocation service failed.' :
                'Error: Your browser doesn\'t support geolocation.'
            );
            infoWindow.open(map);
        }


        function codeAddress() {

            map = new google.maps.Map(document.getElementById('map'), {
                // center: { lat: 10.8482599, lng: 106.7841407 },
                zoom: 15
            });
           
            var address = document.getElementById('address').value;
            console.log("address: " + address);
            geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'address': address }, function (results, status) {
                if (status == 'OK') {
                    console.log('location: ' + results[0].geometry.location);
                    map.setCenter(results[0].geometry.location);
                    var marker = new google.maps.Marker({
                        map: map,
                        position: results[0].geometry.location
                    });
                } else {
                    alert('Geocode was not successful for the following reason: ' + status);
                }
            });
        }
        
    }

})();

