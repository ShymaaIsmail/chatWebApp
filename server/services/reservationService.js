const reservation = require("../models/reservationModel")

var mongoose = require('mongoose');  
var  repos = require("../Repositories/Repos.js") ;
 
var reservationRepo = repos.reservationRepo;


function getAllreservations() {
 return reservationRepo.find().then(function(reservations){
    return reservations;
});
};
 
function getguestReservationByEmail(guestMail) {

      return reservationRepo.find({ "guestEmail": guestMail }).then(function (reservations) {
    return reservations;
});
};



function checkDateAvailability(date, currentguestMail) {

    return reservationRepo.find({ "reservationDate": date, "guestEmail": { "$nin": [currentguestMail] } }).then(function (reservations) {
        return reservations;
    });
};

function createreservation(new_reservation) {
  
    return reservationRepo.add(new_reservation).then(function (reservation) {
        console.log(reservation);
   return reservation;

});

};
 
function getreservation(reservationId) {
return  reservationRepo.findByID(reservationId).then(function(err, reservation) {
    if (err)
     return err;
     
     return reservation;
  });
};

 function updatereservation(reservationId, obj) {
    return reservationRepo.findOneAndUpdate({ _id: reservationId }, obj, { new: true }, function (err, reservation) {
        if (err)
            return err;
        return reservation;
    });
}
 

 module.exports = {

     getAllreservations: function () { return getAllreservations(); },

     createreservation: function (new_reservation) { return createreservation(new_reservation); },

     getguestReservationByEmail: function (guestMail) { return getguestReservationByEmail(guestMail); },

     getreservation: function (reservationId) { return getreservation(reservationId); },

     checkDateAvailability: function (date, currentguestMail) { return checkDateAvailability(date, currentguestMail); },

     updatereservation: function (reservationId, obj) { return updatereservation(reservationId, obj); }

 }