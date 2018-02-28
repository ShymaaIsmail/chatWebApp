'use strict';
 const message = require("../models/messageModel")
  
var  messageService = require("../services/messageService.js") ;
 
 

exports.create_message = function(req, res) {

  console.log(req.body);  

 var new_nessage = new message(req.body);
 messageService.createMessage(new_nessage).then(function(msg){
  console.log(msg);  
  res.json(msg);
}).catch(function(err) {
  console.log(err.message);
});
};