/*jshint esversion: 6 */

var Hotel = require('./../models/hotel.model');
var successMessage = require('./../services/successMessage');
var failMessage = require('./../services/failMessage');
var hotelDao = require('.././dao/hotel.dao');
var geolib = require('geolib');


module.exports = {
    registerHotel: registerHotel,
    convertHotelModelToHotelResponse: convertHotelModelToHotelResponse,
    getHotelsPositionByDistance: getHotelsPositionByDistance
};

function convertHotelModelToHotelResponse(hotelModel) {
    var hotelObj = hotelModel.toObject();

    return hotelObj;
}

function registerHotel(request) {

    return Hotel.findOne({ location: request.location })
        .then((hotel) => {
            console.log('0');
            if (hotel) {
                return Promise.reject({
                    statusCode: 400,
                    message: failMessage.hotel.register.duplicateHotel
                });
            }

            var newHotel = new Hotel({
                userId: request.userId,
                name: request.name,
                address: request.address,
                location: request.location,
                phone: request.phone,
                website: request.website,
                type: 'lodging',
                // rating: request.rating,
            });

            return newHotel.save()
                .then((response) => {
                    return Promise.resolve({
                        message: successMessage.hotel.register,
                        hotel: convertHotelModelToHotelResponse(response)
                    });

                }).catch((err) => {
                    console.log('err1: ' + err);
                    return Promise.reject({
                        message: failMessage.hotel.register.systemErr
                    });
                });
        })
        .catch((err) => {
            console.log('2');
            return err;
            // Promise.reject({
            //     statusCode: 400,
            //     message: failMessage.hotel.register.systemErr
            // });
        });
}

function getHotelsPositionByDistance(request) {

    return Hotel.find().exec()
        .then(function (listHotels) {
            var results = [];
            listHotels.forEach(function (hotel) {
                //location: {longitude, latitude} => {latitude, longitude}
                var permutePosition = {latitude: hotel.location.latitude, longitude: hotel.location.longitude};
                // var permuteStartPosition = {latitude: request.start.latitude, longitude: request.start.longitude};
                var origin = {latitude: request.latOrigin, longitude: request.lngOrigin};
                var distance = geolib.getDistance(origin, permutePosition);//{latitude: -33.867591, longitude: 151.201196}
                if(distance <= request.distance){
                    results.push(hotel);
                }
            });

            return Promise.resolve({
                message: successMessage.hotel.getHotelsPositionByDistance,
                results: results
            });
        })
        .catch((err) => {
            console.log('errr:' + err);
            return err;
        });
    //db.collection.find(query, projection)
    // var value = Hotel.find({}, {"name": 1, "_id": 0});
    // console.log("value: " + value);
    // Hotel.forEach(function (value){
    //     console.log("value: " + value);
    // })
}

