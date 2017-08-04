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

        //google.maps.event.addDomListener(window, 'load', initMap);

        initMap();
        // zoomControl();

        // vm.images = [1, 2, 3, 4, 5, 6, 7, 8];

        // vm.loadMore = function () {
        //     var last = vm.images[vm.images.length - 1];
        //     for (var i = 1; i <= 100; i++) {
        //         vm.images.push(last + i);
        //     }
        //     console.log(vm.images);
        // };

        

        var map, infoWindow;
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


        // function zoomControl() {
        //     var zoomInButton = document.getElementById('zoomIn');
        //     var zoomOutButton = document.getElementById('zoomOut');
        //     google.maps.event.addDomListener(zoomInButton, 'click', function () {
        //         map.setZoom(map.getZoom() + 1);
        //     });
        //     google.maps.event.addDomListener(zoomOutButton, 'click', function () {
        //         map.setZoom(map.getZoom() - 1);
        //     });
        // }
    }

})();

