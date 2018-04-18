'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var reservationSchema = new Schema({

    guestName: {
        type: String,
        required: 'Kindly enter the name of the guest'
    },

    guestEmail: {
        type: String,
        required: 'Kindly enter the email of the guest'
    },
    reservationDate: {
        type: Date 
    },
    Created_date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('reservations', reservationSchema);;