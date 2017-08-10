/*jshint esversion: 6*/
(function () {
    'use strict';

    angular
        .module('app.gmap', ['ngGeolocation', 'infinite-scroll'])
        .controller('GmapController', GmapController);
    //.directive('myMap', myApp);

    GmapController.$inject = ['logger', '$geolocation', '$scope'];
    /* @ngInject */
    function GmapController(logger, $geolocation, $scope) {

        var vm = this;
        var map;
      vm.marker = 0;
      var infowindow;
      var messagewindow;

      vm.saveData = saveData;

      initMap();

      function initMap() {
        var california = {lat: 37.4419, lng: -122.1419};
        map = new google.maps.Map(document.getElementById('map'), {
          center: california,
          zoom: 13
        });

        infowindow = new google.maps.InfoWindow({
          content: document.getElementById('form')
        });

        messagewindow = new google.maps.InfoWindow({
          content: document.getElementById('message')
        });

        google.maps.event.addListener(map, 'click', function(event) {
          vm.marker = new google.maps.Marker({
            position: event.latLng,
            map: map
          });

          console.log("marker: " + vm.marker);
          google.maps.event.addListener(vm.marker, 'click', function() {
            infowindow.open(map, vm.marker);
          });
        });
      }

      function saveData() {
        var name = escape(document.getElementById('name').value);
        var address = escape(document.getElementById('address').value);
        var type = document.getElementById('type').value;
        console.log("marker: " + vm.marker);
        var latlng = vm.marker.getPosition();
        var url = 'phpsqlinfo_addrow.php?name=' + name + '&address=' + address +
                  '&type=' + type + '&lat=' + latlng.lat() + '&lng=' + latlng.lng();

        downloadUrl(url, function(data, responseCode) {

          if (responseCode == 200 && data.length <= 1) {
            infowindow.close();
            messagewindow.open(map, vm.marker);
          }
        });
      }

      function downloadUrl(url, callback) {
        var request = window.ActiveXObject ?
            new ActiveXObject('Microsoft.XMLHTTP') :
            new XMLHttpRequest;

        request.onreadystatechange = function() {
          if (request.readyState == 4) {
            request.onreadystatechange = doNothing;
            callback(request.responseText, request.status);
          }
        };

        request.open('GET', url, true);
        request.send(null);
      }

      function doNothing () {
      }
    }

})();

