/*jshint esversion: 6*/
(function () {
  'use strict';

  angular
    .module('app.gmap', ['ngGeolocation', 'infinite-scroll'])
    .controller('GmapController', GmapController);
  //.directive('myMap', myApp);

  GmapController.$inject = ['$q', 'logger', '$geolocation', '$scope', 'hotelService', '$state'];
  /* @ngInject */
  function GmapController($q, logger, $geolocation, $scope, hotelService, $state) {

    var vm = this;
    var map;
    vm.marker = 0;
    var infowindow;
    var messagewindow;
    vm.saveData = saveData;
    vm.initMap = initMap;
    vm.clickSave = clickSave;

    vm.register = register;
    
    function register(name, address, lat, lng) {
      var location = {
        "latitude": lat,
        "longitude": lng
      }
        var newHotel = {
            name: name,
            address: address,
            location: location,
        };

        return hotelService.register(newHotel).then(
            function (res) {
                toastr.success(res);
                // $state.go('layout.listhotels');
            },
            function (err) {
                toastr.error(err);
            }
        );
    };

    function initMap() {
      var vn = { lat: 14.058324, lng: 108.277199 };
      map = new google.maps.Map(document.getElementById('map'), {
        center: vn,
        zoom: 8
      });

      infowindow = new google.maps.InfoWindow({
        content: document.getElementById('form')
      });

      messagewindow = new google.maps.InfoWindow({
        content: document.getElementById('message')
      });

      //Khi click vào map=> Hiển thị marker
      // google.maps.event.addListener(map, 'click', function (event) {
      //       vm.marker = new google.maps.Marker({
      //         position: event.latLng,
      //         map: map
      //       });

      //       //Khi click vào marker => Hiển thị ra InfoWindow
      //       google.maps.event.addListener(vm.marker, 'click', function () {
      //         infowindow.open(map, vm.marker);
      //       });
      //     });

      listenerMarker(map);

    }

    function listenerMarker(map) {

      var deferred = $q.defer();

      google.maps.event.addListener(map, 'click', function (event) {
          vm.marker = new google.maps.Marker({
            position: event.latLng,
            map: map
          });

          console.log("marker: " + vm.marker);
          google.maps.event.addListener(vm.marker, 'click', function () {
            infowindow.open(map, vm.marker);
          });
        });

      deferred.resolve(vm.marker);

      return deferred.promise;
    }

    function clickSave() {


      var promise = listenerMarker(map);
      promise.then(function () {
        saveData();
      }, function () {
        alert("Loi roi");
      });
    }


    function saveData() {

      var name = (document.getElementById('name').value);
      console.log("Name: " + name);
      // var address = escape(document.getElementById('address').value);
      var address = document.getElementById('address').value;
      var type = document.getElementById('type').value;

      var position = vm.marker.getPosition(); //position: (lat, lng)
      var arr = position.toString().split(",");
      var lat = (arr[0].split('('))[1];
      var lng = (arr[1].split(')'))[0];
      

      register(name, address, lat, lng);

      // alert("position: " + position);
      // var url = 'phpsqlinfo_addrow.php?name=' + name + '&address=' + address +
      //   '&type=' + type + '&lat=' + position.lat() + '&lng=' + position.lng();

      // downloadUrl(url, function (data, responseCode) {

      //   if (responseCode == 200 && data.length <= 1) {
      //     infowindow.close();
      //     messagewindow.open(map, vm.marker);
      //   }
      // });
    }

    function downloadUrl(url, callback) {
      var request = window.ActiveXObject ?
        new ActiveXObject('Microsoft.XMLHTTP') :
        new XMLHttpRequest;

      request.onreadystatechange = function () {
        if (request.readyState == 4) {
          request.onreadystatechange = doNothing;
          callback(request.responseText, request.status);
        }
      };

      request.open('GET', url, true);
      request.send(null);
    }

    function doNothing() {
    }
  }

})();

