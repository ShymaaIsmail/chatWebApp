import unique from 'array-unique';
import async from 'async';
import chat from "../models/chatModel";
import repos from "../Repositories/Repos.js";
import chatMapperDTO from "../models/dtos/chatDTOMapper.js";
import userervice from "./userService.js";
import messageService from "./messageService.js";
 var chatRepo = new repos().getChatRepo();
 


/*Chat is service is responsible for handling bussiness logic for  */
class chatService {

  constructor() {
  
  }


  /**
   * 
   * @param {*} new_chat 
   * This is to add new chat record to db, it sort members ids ,to make search in memebers array easy later
   */
  createChat(new_chat) {
    new_chat.members = new_chat.members.sort();
    
    return chatRepo.add(new_chat).then(function (chat) {
      return chat;
    });

  }

  /**
   * 
   * @param {*} userID 
   * This is to list all chats that this  userid is involved in them as a memeber,
   * Also Very Important point its to retrieve last message per each chat
   */
  getChatsByMemberUserID(userID) {
    var chatDtos = [];
    var contactUsers = [];
    var arrPromises = [];
    var arrMsgPromises = [];
    
    var chatsPromise = chatRepo.find({
      "members": {
        $in: [userID]
      }
    }).then(function (chats) {
      return chats;
    });
    var promiseUsers = userervice.getAllUsers().then(function (users) {
      return users;
    });
    arrPromises.push(chatsPromise);
    arrPromises.push(promiseUsers);

    return Promise.all(arrPromises).then(function (results) {
      var chats = results[0];
      var users = results[1];
      //Get LastMessage For Each Chat.
      for (var i = 0; i < chats.length; i++) {
        var chat = chats[i];
        var contactUserID = chat.members.filter(function (value) {
          return value !== userID;
        });
        var user = users.filter(function (value) {
          return value._id.toString() == contactUserID;
        })[0];

        contactUsers.push(user);
        var lastMsgPromise = messageService.getLastChatMessage(chat._id);
        arrMsgPromises.push(lastMsgPromise);
      }
      //resolve msgs
      return Promise.all(arrMsgPromises).then(function (results) {
        for (var i = 0; i < results.length; i++) {
          var msg = results[i];
          var user = contactUsers[i];
          var chat = chats[i];
          var obj = new chatMapperDTO().chatDTO(chat, user, msg);
          chatDtos.push(obj);
        }
        return chatDtos;
      });
    });
  }

  /**
   * 
   * @param {*} userID 
   * 
   * This is to list all users who chat before with the passed userid
   * 
   */
  getContactList(userID) {
    
    return chatRepo.find({
      "members": userID
    }).then(function (chats) {
      var contacts = [];
      var contctUserIDs = [];
      //1-get chats that i have been involved in.
      //2-Extract unique members users ids
      //3-get users complete info per each unique user id.
      for (var i = chats.length - 1; i >= 0; i--) {
        var chatMembers = chats[i].members;
        for (var c = chatMembers.length - 1; c >= 0; c--) {
          contctUserIDs.push(chatMembers[c]);
        }

      }
      //remove duplicate ids.
      contctUserIDs = unique(contctUserIDs);
      //remove userid from the list
      var index = contctUserIDs.indexOf(userID); //  
      if (index !== -1) {
        contctUserIDs.splice(index, 1);
      }
      //here :contctUserIDs represne the unique contacts of this account.

      return userervice.getMultipleUsers(contctUserIDs).then(function (users) {
        contacts = users;

        return contacts;

      });
    });

  }

  /**
   * 
   * @param {*} chatId 
   * @param {*} loggedUserID 
   * This is to list chat details (ListOfMessages and Memebr User Object)
   */
  getChatDetails(chatId, loggedUserID) {
   
    return chatRepo.findByID(chatId).then(function (chat) {
      var chatDetails = {};
      var contactUserID = chat.members.filter(function (value) {
        return value !== loggedUserID;
      });
        return userervice.getUser(contactUserID).then(function (user) {
 
        return messageService.getMessagesByChatId(chatId).then(function (messages) {


          chatDetails = new chatMapperDTO().chatDetailDTO(chat, user, messages)

          return chatDetails;
        });

      });


    });
  }


  /**
   * 
   * @param {*} arrMemebers 
   * @param {*} loggedInUser 
   * 
   * This is to create a new chat to gather the array of users id (arrMemebers) in one chat,
   * 
   * Or to Retrieve this chat if they were involved in a chat before.
   */
  getCreateChatByMembers(arrMemebers, loggedInUser) {

    arrMemebers = arrMemebers.sort();
    
    return chatRepo.find({
      "members": arrMemebers
    }, null, null, 1, null).then(function (existedChat) {
      if (existedChat != "") //existed chat
      {

        return this.getChatDetails(existedChat[0]._id, loggedInUser).then(function (detail) {

          return detail;

        });


      } else { //cretae chat
        var new_chat = new chat();
        new_chat.members = arrMemebers;

        return this.createChat(new_chat).then(function (newChat) {
          return this.getChatDetails(newChat._id, loggedInUser).then(function (detail) {

            return detail;

          });


        });



      };
    });

  }

}


export default new chatService();