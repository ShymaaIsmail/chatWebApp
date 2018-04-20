'use strict';
import mongoose from 'mongoose';


 class User extends mongoose.Schema {

  constructor() {
    const user = super({

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

    return user;
  }
}


export default mongoose.model('users', new User());