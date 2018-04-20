'use strict';
import mongoose from 'mongoose';

 class Message extends mongoose.Schema {

  constructor() {
    const message = super({

      chatID: {
        type: String,
        required: 'required chaat id'
      },

      SenderID: {
        type: String,
        required: 'required chaat id'
      },

      Text: {
        type: String

      },

      AttachmentPath: {
        type: String
      },

      IsSeen: {
        type: Boolean,
        default: false
      },

      Created_date: {
        type: Date,
        default: Date.now
      }


    });

    return message;
  }
}


export default mongoose.model('messages', new Message())