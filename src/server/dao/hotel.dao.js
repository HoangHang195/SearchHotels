var Hotel = require('./../model/hotels.model');
var successMessage = require('./../services/successMessage');
var failMessage = require('./../services/failMessage');
var hotelDao = require('.././dao/hotel.dao');


module.exports = {
    signin: signin,
    
};

function signin(request) {
    // console.log(request);
    
    return User.findOne({
        email: request.email
    }) 
    .then((user) => {
        if(!user){
            return Promise.reject({
                statusCode: 404,
                message: failMessage.user.login.notFound
            });
        }

        if (cryptoPasswordUtil.verifyPassword(user.password, user.salt, request.password)) {
            var token = jwt.signToken(userDao.convertUserModelToUserResponse(user));
            return Promise.resolve({
                message: successMessage.user.login,
                'email': userDao.convertUserModelToUserResponse(user),
                'token': token
            });
        } 

        return Promise.reject({
            statusCode: 400,
            message: failMessage.user.login.inCorrect
        });
    })
    .catch(() => {
        Promise.reject(() => {
            message: failMessage.user.login.systemErr
        })
    });
}