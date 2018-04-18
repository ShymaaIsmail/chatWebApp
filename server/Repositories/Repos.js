'use strict';

const repo = require("mongoose-repository-pattern");

var  config = require("../config/database.config.js") ;
 
//user model and repo
const user = require("../models/userModel")
var userRepo = repo(user,config.dbUrl);

//chat model and repo
const chat = require("../models/chatModel")
var chatRepo = repo(chat,config.dbUrl);


//message model and repo
const message = require("../models/messageModel")
var messageRepo = repo(message,config.dbUrl);

//reservation model and repo
const reservation = require("../models/reservationModel")
var reservationRepo = repo(reservation, config.dbUrl);



module.exports = {
    userRepo: userRepo,
    chatRepo: chatRepo,
    messageRepo: messageRepo,
    reservationRepo: reservationRepo
}