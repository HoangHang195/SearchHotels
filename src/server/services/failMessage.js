var hotel = {
    login: {
        input: 'ERROR_INPUT',
        systemErr: 'SYSTEM_ERROR',
        notFound: 'USER_NOT_FOUND',
        inCorrect: 'PASSWORD_INCORRECT'
    },
    register: {
        input: 'ERROR_INPUT', 
        duplicateHotel: 'DUPLICATE_HOTEL',
        systemErr: 'SYSTEM_ERROR',
    },
    
};

var user = {
    signup: {
        input: 'ERROR_INPUT',
        duplicateUser: 'DUPLICATE_USER',
        systemErr: 'SYSTEM_ERROR',
    },
    signin: {
        input: 'ERROR_INPUT',
        systemErr: 'SYSTEM_ERROR',
        notFound: 'USER_NOT_FOUND',
        inCorrect: 'PASSWORD_INCORRECT'
    },

}

module.exports = {
    hotel: hotel,
    user: user
};