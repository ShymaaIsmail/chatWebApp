import message from "../models/messageModel";

import repos from "../Repositories/Repos.js";


/*Message is service is responsible for handling bussiness logic for  */
class messageService {

  constructor() {
    this.messageRepo = new repos().genericRepo("messageModel");

  }

  /**
   * Add New Message
   * @param {*} newMessage 
   */
  createMessage(newMessage) {
    return this.messageRepo.add(newMessage).then(function (msg) {
      return msg;
    });
  }


  /**
   * Get Last Sent message in a certain chat
   * @param {*} chatId 
   */
  getLastChatMessage(chatId) {

    //categoryRepo.find({isActive: true}, "categoryName description", 10, 10, {categoryName: 1})
    return this.messageRepo.find({
      "chatID": chatId
    }, null, null, 1, {
      Created_date: -1
    }).then(function (msgs) {

      return msgs;
    });
  };

  /**
   * Get Chat history 
   * @param {*} chatId 
   */
  getMessagesByChatId(chatId) {
    return this.messageRepo.find({
      "chatID": chatId
    }).then(function (msgs) {
      return msgs;
    });
  };

}

export default new messageService();