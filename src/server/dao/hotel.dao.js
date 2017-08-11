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
    // var distance = geolib.getDistance(
    //     { latitude: 52.5103, longitude: 7.49347 },
    //     { latitude: "51° 31' N", longitude: "7° 28' E" }
    // );
    // console.log("Distance: " + distance);
    // getHotelsPositionByDistance();
    return Hotel.findOne({ location: request.location})
        .then((hotel) => {
            console.log('0');
            if (hotel) {
                return Promise.reject({
                    statusCode: 400,
                    message: failMessage.hotel.register.duplicateHotel
                });
            }


            var newHotel = new Hotel({
                name: request.name,
                address: request.address,
                location: request.location,
                phone: request.phone,
                website: request.website,
                type: request.type,
                photos: request.photos,
                rating: request.rating,
                reviews: request.reviews,
                logo: request.logo,
                vicinity: request.vicinity,
            });

            return newHotel.save()
                .then((response) => {
                    return Promise.resolve({
                        message: successMessage.hotel.register,
                        hotel: convertHotelModelToHotelResponse(response)
                    });

                }).catch(() => {
                    console.log('1');
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

function getHotelsPositionByDistance(request){
    
    return Hotel.find({}, {"location": 1, "_id": 0}).exec()
    .then(function(listPosition){
        return Promise.resolve({
             message: successMessage.hotel.register,
             listPosition: listPosition
        });
    })
    .catch((err) =>{
        console.log('err:' + err);
        return err;
    });
    //db.collection.find(query, projection)
    // var value = Hotel.find({}, {"name": 1, "_id": 0});
    // console.log("value: " + value);
    // Hotel.forEach(function (value){
    //     console.log("value: " + value);
    // })
}

