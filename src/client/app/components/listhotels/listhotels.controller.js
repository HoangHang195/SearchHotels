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
        var markerUser = '';
        var map, places;
        var hostnameRegexp = new RegExp('^https?://.+?/');
        var infoWindow = new google.maps.InfoWindow({
            content: document.getElementById('info-content')
        });
        var myRadius = 1000;
        vm.displayHotelsPosition = displayHotelsPosition;
        vm.initMap = initMap;

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
                if (place.geometry) {
                    // map.panTo(place.geometry.location);
                    map.setCenter(place.geometry.location);
                    map.setZoom(15);
                    console.log('place: ' + place.geometry.location);
                    //convert (10.8119067, 106.70933760000003) => {lat: 10.8119067, lng: 106.70933760000003}
                    var arr = place.geometry.location.toString().split(",");
                    var lat = Number((arr[0].split('('))[1]);
                    var lng = Number((arr[1].split(')'))[0]);
                    var latLng = { lat: lat, lng: lng };
                    displayHotelsPosition(latLng, myRadius);
                    //To direct 
                    directionsSv.setOrigin(place.geometry.location);
                    console.log('listhotel directionsSv.getOrigin', JSON.stringify(directionsSv.getOrigin()));
                    console.log('listhotel place.geometry.location', JSON.stringify(place.geometry.location));
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
                    document.getElementById('autocomplete').value = '';
                    // clearResults();
                    // clearMarkers();
                });

            // document.getElementById('radius').addEventListener(
            //     'change', function setRadius() {
            //         var radius = document.getElementById('radius').value;
            //         if (radius === '500') {
            //             myRadius = 500;
            //             map.setZoom(17);
            //             displayHotelsPosition(latLng, myRadius);
            //         } else if (radius === '1000') {
            //             myRadius = 1000;
            //             map.setZoom(15);
            //             displayHotelsPosition(latLng, myRadius);
            //         } else if (radius === '2000') {
            //             myRadius = 2000;
            //             map.setZoom(14);
            //             displayHotelsPosition(latLng, myRadius);
            //         } else if (radius === '3000') {
            //             myRadius = 3000;
            //             map.setZoom(13);
            //             displayHotelsPosition(latLng, myRadius);
            //         } else {
            //             myRadius = 4000;
            //             map.setZoom(12);
            //             displayHotelsPosition(latLng, myRadius);
            //         }
            //     });

            var userPosition = getUserCurrentPosition().then(function (pos) {
                map.setCenter(pos);
                markerUserPosition(map, pos);
                displayHotelsPosition(pos, myRadius);
                //To direct
                directionsSv.setOrigin(pos);
                geocodeLatLng(pos).then(function (address) {
                    document.getElementById('autocomplete').value = address;
                });
            });
        }

        function getUserCurrentPosition() {
            var deferred = $q.defer();
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
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
            map.setZoom(15);

            var marker = new google.maps.Marker({
                position: position,
                map: map,
                icon: '/src/client/assets/images/person-location.png',
                title: 'Vị trí của bạn'
            });
            markerUser = marker;
        }

        function clearMarkerUserPosition() {
            markerUser.setMap(null);
            markerUser = '';
        }

        // Search for hotels in the selected city, within the viewport of the map.
        function search(location, radius) {
            clearMarkerUserPosition();
            markerUserPosition(map, location);
            var search = {
                location: location,
                radius: radius,
                types: ['lodging']
            };
            var deferred = $q.defer();
            places.nearbySearch(search, function (results, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    clearResults();
                    clearMarkers();
                    deferred.resolve(results);
                };
            });
            return deferred.promise;
        }

        function displayHotelsPosition(location, radius) {
            //Near by search
            search(location, radius).then(function (results) {
                clearResults();
                clearMarkers();
                // Create a marker for each hotel found, and
                // assign a letter of the alphabetic to each marker icon.
                for (var i = 0; i < results.length; i++) {
                    // Use marker animation to drop the icons incrementally on the map.
                    markers[i] = new google.maps.Marker({
                        position: results[i].geometry.location,
                        animation: google.maps.Animation.DROP,
                        label: i.toString()
                    });
                    // If the user clicks a hotel marker, show the details of that hotel
                    // in an info window.
                    markers[i].placeResult = results[i];
                    google.maps.event.addListener(markers[i], 'click', showInfoWindow_new);
                    setTimeout(dropMarker(i), i * 100);
                    addResult(results[i], i);
                }

                //get local DB around current position
                console.log('results: ', results);
                var start = { latitude: location.lat, longitude: location.lng };
                var arr = hotelService.getHotelsPositionByDistance(start, radius).then(function (localPosition) {

                    console.log('localPosition: ', (localPosition.results));
                    for (var i = results.length; i < results.length + localPosition.results.length; i++) {
                        var latLng = {
                            lat: localPosition.results[i - results.length].location.latitude,
                            lng: localPosition.results[i - results.length].location.longitude,
                        }
                        console.log(latLng);
                        markers[i] = new google.maps.Marker({
                            position: latLng,
                            animation: google.maps.Animation.DROP,
                            label: (i - results.length + 1).toString(),
                            map: map
                        });

                        markers[i].placeResult = localPosition.results[i - results.length];
                        google.maps.event.addListener(markers[i], 'click', showInfoWindow);
                        setTimeout(dropMarker(i), i * 100);
                        addResult(localPosition.results[i - results.length], i);
                    }
                });
            });
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
        //display list hotels
        function addResult(result, i) {

            var tr = document.createElement('tr');
            tr.style.backgroundColor = (i % 2 === 0 ? '#d4ffeb' : '#fbfbfb');
            tr.onclick = function () {
                google.maps.event.trigger(markers[i], 'click');
            };

            var iconTd = document.createElement('td');
            var icon = document.createElement('img');
            icon.src = '/src/client/assets/images/hotel_icon.png';
            // icon.setAttribute('class', 'placeIcon');
            // icon.setAttribute('className', 'placeIcon');

            var sttTd = document.createElement('td');
            var nameTd = document.createElement('td');

            var name = document.createTextNode(result.name);
            var stt = document.createTextNode(i.toString());

            iconTd.appendChild(icon);
            sttTd.appendChild(stt);
            nameTd.appendChild(name);

            tr.appendChild(iconTd);
            tr.appendChild(sttTd);
            tr.appendChild(nameTd);

            results.appendChild(tr);
        }

        // Get the place details for a hotel. Show the information in an info window,
        // anchored on the marker for the hotel that the user selected.
        function showInfoWindow() {
            var marker = this;
            infoWindow.open(map, marker);
            //To directions
            console.log('destination ', (marker.placeResult.location));
            directionsSv.setDestination(marker.placeResult.location);
            buildIWContent(marker.placeResult);
        }

        function showInfoWindow_new() {
            var marker = this;

            places.getDetails({ placeId: marker.placeResult.place_id },
                function (place, status) {
                    if (status !== google.maps.places.PlacesServiceStatus.OK) {
                        return;
                    }
                    infoWindow.open(map, marker);
                    var myResult = {
                        name: place.name,
                        address: place.vicinity,
                        location: place.geometry.location,
                        phone: place.formatted_phone_number,
                        website: place.website,
                        type: place.type,
                        rating: place.rating,
                    }
                    buildIWContent(myResult);
                    //to directions 
                    directionsSv.setDestination(myResult.location);
                });
        }

        // Load the place information into the HTML elements used by the info window.
        function buildIWContent(place) {
            document.getElementById('iw-icon').innerHTML = '<img class="hotelIcon" ' +
                'src="/src/client/assets/images/hotel_name.png"/>';
            // console.log(place);
            document.getElementById('iw-url').innerHTML = '<b>' + place.name + '</b>';
            document.getElementById('iw-address').textContent = place.address;

            if (place.phone) {
                document.getElementById('iw-phone-row').style.display = '';
                document.getElementById('iw-phone').textContent =
                    place.phone;
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
                            reject('No results found');
                        }
                    } else {
                        window.alert('Geocoder failed due to: ' + status);
                        reject('Geocoder failed due to: ' + status);
                    }
                });
            });
        }
    }
})();