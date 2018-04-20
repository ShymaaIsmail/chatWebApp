import mongoose from 'mongoose';
import repos from "../Repositories/Repos.js";
import reservation from "../models/reservationModel";



/*Reservation is service is responsible for handling bussiness logic for  */
class reservationService {

    constructor() {
        this.reservationRepo = new repos().genericRepo("reservationModel");

    }
 
    /**
     * Get a guest reservation by his email and email should represent one guest
     * @param {*} guestMail 
     */
    getguestReservationByEmail(guestMail) {

        return this.reservationRepo.find({
            "guestEmail": guestMail
        }).then(function (reservations) {
            return reservations;
        });
    };


    /**
     * Check If there are any reservation in this date for any other guest
     * @param {*} date 
     * @param {*} currentguestMail 
     */
    checkDateAvailability(date, currentguestMail) {

        return this.reservationRepo.find({
            "reservationDate": date,
            "guestEmail": {
                "$nin": [currentguestMail]
            }
        }).then(function (reservations) {
            return reservations;
        });
    };

    /**
     * Add New reservation
     * @param {*} new_reservation 
     */
    createreservation(new_reservation) {

        return this.reservationRepo.add(new_reservation).then(function (reservation) {
            console.log(reservation);
            return reservation;

        });

    };

}
export default new reservationService();
