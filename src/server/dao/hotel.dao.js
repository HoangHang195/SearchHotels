/*jshint esversion: 6 */

var Hotel = require('./../models/hotel.model');
var successMessage = require('./../services/successMessage');
var failMessage = require('./../services/failMessage');
var hotelDao = require('.././dao/hotel.dao');


module.exports = {
    registerHotel: registerHotel,
    convertHotelModelToHotelResponse: convertHotelModelToHotelResponse

};

function convertHotelModelToHotelResponse(hotelModel) {
    var hotelObj = hotelModel.toObject();
    
    return hotelObj;
}

function registerHotel(request) {
    return Hotel.findOne({ location: request.location })
        .then((hotel) => {
            console.log("0");
            if (hotel) {
                
                return Promise.reject({
                    statusCode: 400,
                    message: failMessage.hotel.register.duplicateHotel
                });
            }

            console.log("hotel: " + hotel);
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
                    console.log("1");
                    return Promise.reject({
                        message: failMessage.hotel.register.systemErr
                    });
                });
        })
        .catch((err) => {
            console.log("2");
            return Promise.reject({
                statusCode: 400,
                message: failMessage.hotel.register.systemErr
            });
        });
}