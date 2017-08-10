/*jshint esversion: 6 */
var router = require('express').Router();
var hotelDao = require('./../dao/hotel.dao');
var failMessage = require('./../services/failMessage');
var successMessage = require('./../services/successMessage');

module.exports = function () {

    
    router.post('/registerHotel', registerHotel);
    console.log("hello: ");

    function registerHotel(req, res, next){
        var request = {
            name: req.body.name,
            address: req.body.address,
            location: req.body.location,
            phone: req.body.phone,
            website: req.body.website,
            type: req.body.type,
            photos: req.body.photos,
            rating: req.body.rating,
            reviews: req.body.reviews,
            logo: req.body.logo,
            vicinity: req.body.vicinity,
        };
        console.log("request: " + request);
        if (request.name === '' || request.address === '' || request.location === '') {
            res.status(403).send(failMessage.hotel.register.input).end();
        }
        hotelDao.registerHotel(request)
            .then((response) => {
                res.status(200).send(response).end()
            }).catch((err) => {
                console.log("Err: " + JSON.stringify(err));
                res.status(err.statusCode).send(err.message).end();
                // next(err);
            });
    }

    return router;
};