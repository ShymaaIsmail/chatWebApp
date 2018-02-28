'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var messageSchema = new Schema({
   
   chatID:
   {
     type: String,
   	required:'required chaat id'
   },

   SenderID:
   {
     type: String,
   	required:'required chaat id'
   },

   Text:{  
   	type: String

   },

   AttachmentPath:{  
   	type: String
   },

   IsSeen:{type:Boolean, default:false},

  Created_date: {
    type: Date,
    default: Date.now
  }


});

module.exports = mongoose.model('messages', messageSchema);;