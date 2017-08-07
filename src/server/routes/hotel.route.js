var router = require('express').Router();
var authDao = require('./../dao/hotel.dao');
var failMessage = require('./../services/failMessage');
var successMessage = require('./../services/successMessage')

module.exports = function () {

    // router.post('/signin', signin);
    router.get('/getHotels', getHotels);
    function getHotels(req, res, next){
        var request = {
            
        }
    }

    function signin(req, res, next) {
        var request = {
            email: req.body.email,
            password: req.body.password
        };
        if (!request.email || !request.password) {
            res.status(403).send(failMessage.user.login.input).end();
        }

        authDao.signin(request) 
        .then((response) => {
            res.status(200).send(response).end();
        })
        .catch((err) => {
            next(err);
        });
    }

    return router;
};