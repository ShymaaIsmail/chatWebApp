'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var userSchema = new Schema({
  name: {
    type: String,
    required: 'Kindly enter the name of the user'
  },

   password: {
    type: String,
    required: 'Kindly enter the password of the user'
  },
  imagePath: {
    type: String,
    required: 'Kindly upload the profile picture of the user'
  },
  Created_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('users', userSchema);