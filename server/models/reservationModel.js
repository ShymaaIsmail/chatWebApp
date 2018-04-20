'use strict';
import mongoose from 'mongoose';

class Reservation extends mongoose.Schema {

    constructor() {
        const reservation = super({

            guestName: {
                type: String,
                required: 'Kindly enter the name of the guest'
            },

            guestEmail: {
                type: String,
                required: 'Kindly enter the email of the guest'
            },
            reservationDate: {
                type: Date,
                required: 'Kindly enter the prefered reservation date of the guest'
            },
            Created_date: {
                type: Date,
                default: Date.now
            }
        });
        return reservation;
    }
}


export default mongoose.model('reservations', new Reservation())