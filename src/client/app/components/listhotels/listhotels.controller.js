/*jshint esversion: 6*/

(function () {
    angular.module('app.listhotels')
        .controller('ListHotelsController', ListHotelsController);

    ListHotelsController.$inject = ['$q', 'directionsSv', 'hotelService'];
    function ListHotelsController($q, directionsSv, hotelService) {

        var vm = this;
        var countries = {
            'vn': {
                center: { lat: 14.058324, lng: 108.277199 },
                zoom: 5
            },
            'au': {
                center: { lat: -25.3, lng: 133.8 },
                zoom: 4
            },
            'br': {
                center: { lat: -14.2, lng: -51.9 },
                zoom: 3
            },
            'ca': {
                center: { lat: 62, lng: -110.0 },
                zoom: 3
            },
            'fr': {
                center: { lat: 46.2, lng: 2.2 },
                zoom: 5
            },
            'de': {
                center: { lat: 51.2, lng: 10.4 },
                zoom: 5
            },
            'mx': {
                center: { lat: 23.6, lng: -102.5 },
                zoom: 4
            },
            'nz': {
                center: { lat: -40.9, lng: 174.9 },
                zoom: 5
            },
            'it': {
                center: { lat: 41.9, lng: 12.6 },
                zoom: 5
            },
            'za': {
                center: { lat: -30.6, lng: 22.9 },
                zoom: 5
            },
            'es': {
                center: { lat: 40.5, lng: -3.7 },
                zoom: 5
            },
            'pt': {
                center: { lat: 39.4, lng: -8.2 },
                zoom: 6
            },
            'us': {
                center: { lat: 37.1, lng: -95.7 },
                zoom: 3
            },
            'uk': {
                center: { lat: 54.8, lng: -4.6 },
                zoom: 5
            }
        };
        var countryRestrict = countryRestrict = { 'country': 'vn' };
        var markers = [];
        var map, places;
        var MARKER_PATH = 'https://developers.google.com/maps/documentation/javascript/images/marker_green';
        var infoWindow = new google.maps.InfoWindow({
            content: document.getElementById('info-content')
        });

        vm.initMap = initMap;

        // function searchLocalPosition(start, distance) {
        //     var arr = hotelService.getHotelsPositionByDistance(start, distance);
        //     console.log('arr: ' + arr);

        //     for (var i = 0; i < results.length; i++) {
        //         // var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
        //         // var markerIcon = MARKER_PATH + markerLetter + '.png';
        //         // Use marker animation to drop the icons incrementally on the map.
        //         markers[i] = new google.maps.Marker({
        //             position: results[i].geometry.location,
        //             animation: google.maps.Animation.DROP,
        //             label: (i + 1).toString(),
        //             // icon: markerIcon
        //         });
        //         // If the user clicks a hotel marker, show the details of that hotel
        //         // in an info window.
        //         markers[i].placeResult = results[i];
        //         google.maps.event.addListener(markers[i], 'click', showInfoWindow);
        //         setTimeout(dropMarker(i), i * 50);
        //         addResult(results[i], i);
        //     }

        // }

        function initMap() {
            map = new google.maps.Map(document.getElementById('map'), {
                zoom: countries['vn'].zoom,
                center: countries['vn'].center,
                streetViewControl: false
            });
            var autocomplete = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */(
                    document.getElementById('autocomplete')), {
                    types: [],
                    componentRestrictions: countryRestrict //Viet Nam
                });

            places = new google.maps.places.PlacesService(map);

            autocomplete.addListener('place_changed', function () {
                var place = autocomplete.getPlace();
                console.log('place: ' + place);
                if (place.geometry) {
                    // map.panTo(place.geometry.location);
                    map.setCenter(place.geometry.location);
                    map.setZoom(10);
                    displayHotelsPosition(place.geometry.location, 5000);
                    //To direct 
                    directionsSv.setOrigin(place.geometry.location);

                } else {
                    document.getElementById('autocomplete').placeholder = 'Enter a city';
                }
            });

            // Add a DOM event listener to react when the user selects a country.
            document.getElementById('country').addEventListener(
                'change', function setAutocompleteCountry() {
                    var country = document.getElementById('country').value;
                    if (country === 'all') {
                        autocomplete.setComponentRestrictions({ 'country': [] });
                        map.setCenter({ lat: 15, lng: 0 });
                        map.setZoom(2);
                    } else {
                        autocomplete.setComponentRestrictions({ 'country': country });
                        map.setCenter(countries[country].center);
                        map.setZoom(countries[country].zoom);
                    }
                    document.getElementById('autocomplete').placeholder = 'Enter a city';
                    // clearResults();
                    // clearMarkers();
                });

            var userPosition = getUserCurrentPosition().then(function (pos) {
                markerUserPosition(map, pos);
                displayHotelsPosition(pos, 5000);
                //To direct
                console.log('pos: ' + JSON.stringify(pos));
                directionsSv.setOrigin(pos);
                geocodeLatLng(pos).then(function (address) {
                    console.log('address: ' + JSON.stringify(address));
                    document.getElementById('autocomplete').value = address;
                });
                //Load local BD
                // searchLocalPosition(pos, 5000);
            });

        }

        function getUserCurrentPosition() {
            var deferred = $q.defer();
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    console.log('position: ' + JSON.stringify(position));
                    var pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    deferred.resolve(pos);
                })
            }
            return deferred.promise;
        }

        function markerUserPosition(map, position) {
            map.setCenter(position);
            map.setZoom(13);

            var marker = new google.maps.Marker({
                position: position,
                map: map,
                icon: '/src/client/assets/images/person-location.png',
                title: 'Vị trí của bạn'
            });

        }

        // Search for hotels in the selected city, within the viewport of the map.
        function search(location, radius) {
            markerUserPosition(map, location);
            var search = {
                // bounds: map.getBounds(),
                location: location,
                radius: radius,
                types: ['lodging']
            };

            var deferred = $q.defer();

            places.nearbySearch(search, function (results, status) {
                console.log('results: ' + results);
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    clearResults();
                    clearMarkers();

                    deferred.resolve(results);

                }
            });

            return deferred.promise;
        }

        function displayHotelsPosition(location, radius) {
            //Local BD
            var arr = hotelService.getHotelsPositionByDistance(directionsSv.getOrigin, 5000).then(function(){
                
            });
            console.log('arr: ' +JSON.stringify(arr) );
            var resultsPosition= [];
            //Near by search
            search(location, radius).then(function(results){
                resultsPosition = results;
                console.log('resultsPosition: ' + resultsPosition.length);
            });
            
            // Create a marker for each hotel found, and
            // assign a letter of the alphabetic to each marker icon.
            for (var i = 0; i < results.length; i++) {
                // var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
                // var markerIcon = MARKER_PATH + markerLetter + '.png';
                // Use marker animation to drop the icons incrementally on the map.
                markers[i] = new google.maps.Marker({
                    position: results[i].geometry.location,
                    animation: google.maps.Animation.DROP,
                    label: (i + 1).toString(),
                    // icon: markerIcon
                });
                // If the user clicks a hotel marker, show the details of that hotel
                // in an info window.
                markers[i].placeResult = results[i];
                google.maps.event.addListener(markers[i], 'click', showInfoWindow);
                setTimeout(dropMarker(i), i * 50);
                addResult(results[i], i);
            }
        }

        function dropMarker(i) {
            return function () {
                markers[i].setMap(map);
            };
        }

        function clearMarkers() {
            for (var i = 0; i < markers.length; i++) {
                if (markers[i]) {
                    markers[i].setMap(null);
                }
            }
            markers = [];
        }

        function clearResults() {
            var results = document.getElementById('results');
            while (results.childNodes[0]) {
                results.removeChild(results.childNodes[0]);
            }
        }

        //Hiển thị danh sách
        function addResult(result, i) {
            var results = document.getElementById('results');
            var markerLetter = String.fromCharCode('A'.charCodeAt(0) + (i % 26));
            var markerIcon = MARKER_PATH + markerLetter + '.png';

            var tr = document.createElement('tr');
            tr.style.backgroundColor = (i % 2 === 0 ? '#F0F0F0' : '#FFFFFF');
            tr.onclick = function () {
                google.maps.event.trigger(markers[i], 'click');
            };

            var iconTd = document.createElement('td');
            var nameTd = document.createElement('td');
            // var ratingTd = document.createElement('td');
            var icon = document.createElement('img');
            icon.src = markerIcon;
            // icon.setAttribute('class', 'placeIcon');
            // icon.setAttribute('className', 'placeIcon');
            var name = document.createTextNode(result.name);
            // var rating = document.createTextNode(result.rating);
            //result.photos[0].getUrl({'maxWidth': 35, 'maxHeight': 35})
            iconTd.appendChild(icon);
            nameTd.appendChild(name);
            // ratingTd.appendChild(rating);
            tr.appendChild(iconTd);
            tr.appendChild(nameTd);
            // tr.appendChild(ratingTd);
            results.appendChild(tr);
        }

        // Get the place details for a hotel. Show the information in an info window,
        // anchored on the marker for the hotel that the user selected.
        function showInfoWindow() {
            var marker = this;
            places.getDetails({ placeId: marker.placeResult.place_id },
                function (place, status) {
                    if (status !== google.maps.places.PlacesServiceStatus.OK) {
                        return;
                    }
                    infoWindow.open(map, marker);
                    //To directions
                    directionsSv.setDestination(place.geometry.location);
                    buildIWContent(place);
                });
        }

        // Load the place information into the HTML elements used by the info window.
        function buildIWContent(place) {
            document.getElementById('iw-icon').innerHTML = '<img class="hotelIcon" ' +
                'src="' + place.icon + '"/>';
            // console.log(place);
            document.getElementById('iw-url').innerHTML = '<b><a href="' + place.url +
                '">' + place.name + '</a></b>';
            document.getElementById('iw-address').textContent = place.vicinity;


            if (place.formatted_phone_number) {
                document.getElementById('iw-phone-row').style.display = '';
                document.getElementById('iw-phone').textContent =
                    place.formatted_phone_number;
            } else {
                document.getElementById('iw-phone-row').style.display = 'none';
            }

            // Assign a five-star rating to the hotel, using a yellow star ('&#f9f900;')
            // to indicate the rating the hotel has earned, and a white star ('&#10025;')
            // for the rating points not achieved.
            if (place.rating) {
                var ratingHtml = '';
                for (var i = 0; i < 5; i++) {
                    if (place.rating < (i + 0.5)) {
                        ratingHtml += '&star;';
                    } else {
                        ratingHtml += '&starf;';
                    }
                    document.getElementById('iw-rating-row').style.display = '';
                    document.getElementById('iw-rating').innerHTML = ratingHtml;
                }
            } else {
                document.getElementById('iw-rating-row').style.display = 'none';
            }

            // The regexp isolates the first part of the URL (domain plus subdomain)
            // to give a short URL for displaying in the info window.
            if (place.website) {
                var fullUrl = place.website;
                var website = hostnameRegexp.exec(place.website);
                if (website === null) {
                    website = 'http://' + place.website + '/';
                    fullUrl = website;
                }
                document.getElementById('iw-website-row').style.display = '';
                document.getElementById('iw-website').textContent = website;
            } else {
                document.getElementById('iw-website-row').style.display = 'none';
            }
        }

        //Convert from latlng to address
        function geocodeLatLng(currentPosition) {

            var latlng = { lat: parseFloat(currentPosition.lat), lng: parseFloat(currentPosition.lng) };
            return $q(function (resolve, reject) {
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode({ 'location': latlng }, function (results, status) {
                    if (status === 'OK') {
                        if (results[1]) {
                            results[1].formatted_address;

                            vm.address = results[1].formatted_address;
                            resolve(results[1].formatted_address);

                        } else {
                            window.alert('No results found');
                            reject(null);
                        }
                    } else {
                        window.alert('Geocoder failed due to: ' + status);
                        reject(null);
                    }
                });
            });

        }

    }


})();