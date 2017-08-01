/*jshint esversion: 6*/
(function () {
    'use strict';

    angular
        .module('app.gmap')
        .controller('GmapController', ['$q', '$http', '$state', GmapController]);
        //.directive('myMap', myApp);
       
    //GmapController.$inject = ['logger'];
    /* @ngInject */
    function GmapController() {
        var vm = this;
        vm.title = 'Gmap';


        initMap();

        function initMap() {

            var myLatLng = { lat: 10.7681596, lng: 106.6943671 };

            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 5,
                center: myLatLng
            });

            var marker = new google.maps.Marker({
                position: myLatLng,
                map: map,
                title: 'Hello World!'
            });

            var customMapType = new google.maps.StyledMapType([
                { stylers: [{ hue: '#D2E4C8' }] }, //color
            ]);
            
            var customMapTypeId = 'custom_style';
            map.mapTypes.set(customMapTypeId, customMapType);
            map.setMapTypeId(customMapTypeId);

        };
    }

//directive
    // function myApp() {
    //         // directive link function
    //         var link = function () {
    //             var vm = this;
    //             vm.title = 'Gmap';


                

    //             var map;
    //             //var myLatLng = new google.maps.LatLng(15.9028182, 105.806657);
    //             function initMap() {

    //                 var myLatLng = { lat: 10.7681596, lng: 106.6943671 };

    //                 var map = new google.maps.Map(document.getElementById('map'), {
    //                     zoom: 5,
    //                     center: myLatLng
    //                 });

    //                 var marker = new google.maps.Marker({
    //                     position: myLatLng,
    //                     map: map,
    //                     title: 'Hello World!'
    //                 });

    //                 var customMapType = new google.maps.StyledMapType([
    //                     { stylers: [{ hue: '#D2E4C8' }] }, //color

    //                 ]);
    //                 var customMapTypeId = 'custom_style';
    //                 map.mapTypes.set(customMapTypeId, customMapType);
    //                 map.setMapTypeId(customMapTypeId);

    //             };

    //             initMap();
    //         }

    //         return {
    //             restrict: 'A',
    //             template: '<div id="map"></div>',
    //             replace: true,
    //             link: link
    //         };

    //     }
    
})();

