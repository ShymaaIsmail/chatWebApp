'use strict';
import mongoose from 'mongoose';

  class Chat extends mongoose.Schema{
 
    constructor() {
      const chat = super({
        members: { //user ids of members
          type: [String],
          required: 'Kindly enter the name of the user'
        },
  
        Created_date: {
          type: Date,
          default: Date.now
        }
        
      });
   
      return chat;
    }
  }
  

export default mongoose.model('chats', new Chat())
