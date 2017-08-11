/*jshint esversion: 6*/

(function () {
    angular.module('app.listhotels')
        .controller('ListHotelsController', ListHotelsController);

ListHotelsController.$inject = ['$q', 'directionsSv'];
    function ListHotelsController($q, directionsSv) {
        
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
        vm.countries = countries;
        vm.initMap = initMap;
        vm.onPlaceChanged = onPlaceChanged;
        vm.loadCurrentPosition = loadCurrentPosition;
        var geocoder = new google.maps.Geocoder();
        vm.address = '';
        vm.test = test;
        vm.origin = '';
        vm.destination = '';
    
        var map, places, infoWindow;
        var markers = [];
        var autocomplete = '';
        var countryRestrict = { 'country': 'vn' };
        var MARKER_PATH = 'https://developers.google.com/maps/documentation/javascript/images/marker_green';
        var hostnameRegexp = new RegExp('^https?://.+?/');

        function initMap() {
            map = new google.maps.Map(document.getElementById('map'), {
                zoom: countries['vn'].zoom,
                center: countries['vn'].center,
                streetViewControl: false
            });

            infoWindow = new google.maps.InfoWindow({
                content: document.getElementById('info-content')
            });

            // Create the autocomplete object and associate it with the UI input control.
            // Restrict the search to the default country, and to place type "cities".
            autocomplete = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */(
                    document.getElementById('autocomplete')), {
                    types: [],
                    componentRestrictions: countryRestrict
                });
            places = new google.maps.places.PlacesService(map);
            autocomplete.addListener('place_changed', onPlaceChanged);

            // Add a DOM event listener to react when the user selects a country.
            document.getElementById('country').addEventListener(
                'change', setAutocompleteCountry);
        }
        
        // When the user selects a city, get the place details for the city and
        // zoom the map in on the city.
        function onPlaceChanged() {
            var place = autocomplete.getPlace();
            // var promise = geocodeLatLng(place.geometry.location);
            //vm.origin = place.geometry.location;
            vm.origin = document.getElementById('autocomplete').value;
            
            if (place.geometry) {
                map.panTo(place.geometry.location);
                map.setZoom(15);
                search();
            } else {
                document.getElementById('autocomplete').placeholder = 'Enter a city';
            }
        }

        // Search for hotels in the selected city, within the viewport of the map.
        function search() {
            var search = {
                bounds: map.getBounds(),
                types: ['lodging']
            };

            places.nearbySearch(search, function (results, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    clearResults();
                    clearMarkers();
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
                        setTimeout(dropMarker(i), i * 100);
                        addResult(results[i], i);
                    }
                }
            });
        }

        function clearMarkers() {
            for (var i = 0; i < markers.length; i++) {
                if (markers[i]) {
                    markers[i].setMap(null);
                }
            }
            markers = [];
        }

        // Set the country restriction based on user input.
        // Also center and zoom the map on the given country.
        function setAutocompleteCountry() {
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
            clearResults();
            clearMarkers();
        }

        function dropMarker(i) {
            return function () {
                markers[i].setMap(map);
            };
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

        function clearResults() {
            var results = document.getElementById('results');
            while (results.childNodes[0]) {
                results.removeChild(results.childNodes[0]);
            }
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
                    buildIWContent(place);
                });
        }

        // Load the place information into the HTML elements used by the info window.
        function buildIWContent(place) {
            // console.log('place: ' + JSON.stringify(place));
            document.getElementById('iw-icon').innerHTML = '<img class="hotelIcon" ' +
                'src="' + place.icon + '"/>';
                console.log(place);
            document.getElementById('iw-url').innerHTML = '<b><a href="' + place.url +
                '">' + place.name + '</a></b>';
            document.getElementById('iw-address').textContent = place.vicinity;
            //To directions
            vm.destination = place.vicinity;

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

        //Run when load website
        function loadCurrentPosition(){
            map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: 10.8482599, lng: 106.7841407 },
                zoom: 15
            });
            infoWindow = new google.maps.InfoWindow;
            var deferred = $q.defer();
            
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    var pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                   
                    var place = pos;

                    if (place) {
                        map.panTo(place);
                        map.setZoom(15);

                        var promise = geocodeLatLng(pos);
                        promise.then(function(){
                            document.getElementById('autocomplete').value = vm.address;
                            //To direction 
                            vm.origin = vm.address;
                            console.log('origin1: ' + vm.origin);

                        }, function(){
                            alert('Loi roi');
                        });
                        
                        console.log('geocode: ' + JSON.stringify(geocodeLatLng(pos)));
                        document.getElementById('autocomplete').placeholder = vm.address;
                        search();
                    } else {
                        document.getElementById('autocomplete').placeholder = 'Enter a city';
                    }

                }, function () {
                    handleLocationError(true, infoWindow, map.getCenter());
                });
            }else {
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

        //Convert from latlng to address
        function geocodeLatLng(currentPosition) {
            var input = currentPosition;
            // console.log('input: ' + (input.lat));
            // var latlngStr = input.split(',', 2);
            var latlng = {lat: parseFloat(input.lat), lng: parseFloat(input.lng)};
            return $q(function(resolve, reject) {
                geocoder.geocode({'location': latlng}, function(results, status) {
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

        function test(){
            alert(vm.origin + " =====> " + vm.destination);

            directionsSv.setOrigin(vm.origin);
            directionsSv.setDestination(vm.destination);
            
        }

    }

})();