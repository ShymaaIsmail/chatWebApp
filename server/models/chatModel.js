'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var chatSchema = new Schema({
  members: {//user ids of members
    type:  [String],
    required: 'Kindly enter the name of the user'
  } ,

  Created_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('chats', chatSchema);;