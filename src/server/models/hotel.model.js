var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hotelSchema = new Schema({
    name: { 
        type: String,
        required: true
    },
    address: {
        type: String
    },
    location: {
        latitude: {
            type: Number
        },
        longitude: {
            type: Number
        }
    },
    phone: {
        type: String,
    },
    website: {
        type: String,
    },
    type: {
        type: String
    },
    photos: {
        type: String,
    },
    rating: {
        type: Number
    }, 
    reviews: {
        type: String,
    },
    logo: {
        type: String
    },
    vicinity: {
        type: String,
    },
    
});

var hotel = mongoose.model('hotel', hotelSchema);
module.exports = hotel;
