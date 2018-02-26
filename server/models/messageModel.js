'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var messageSchema = new Schema({
   
   chatID:String,

   SenderID:String,

   Text:String, 

   AttachmentPath:String,

   IsSeen:{type:Boolean, default:false},

  Created_date: {
    type: Date,
    default: Date.now
  }


});

module.exports = mongoose.model('messages', messageSchema);;