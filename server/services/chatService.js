

var unique = require('array-unique');
var async = require('async');

const chat = require("../models/chatModel")
  
var  repos = require("../Repositories/Repos.js") ;

var chatRepo = repos.chatRepo;
var userRepo = repos.userRepo;

var  dtos = require("../models/dtos/chatDTO.js") ;

var  userervice = require("./userService.js") ;

var  messageService = require("./messageService.js") ;
 
////////////////////createChat///////////////////////////////////////////////
function createChat(new_chat) {
  
return chatRepo.add(new_chat).then(function(chat) {
   return chat;
});

};
////////////////////////getAllChats////////////////////////
 function getAllChats() {
 return chatRepo.find().then(function(chats){
    return chats;
});
};
 
////////////////////getChatsByMemberUserID////////////////////////////////////////
 function getChatsByMemberUserID(userID) {
 
 return chatRepo.find({"members":userID}).then(function(chats){
 var chatDtos=[];
  //ToDo:Get LastMessage For Each Chat.
  for (var i = chats.length - 1; i >= 0; i--) {
   var chat= chats[i];
   var contactUserID=chat.members.filter(function(value){return value !==userID;});

   return messageService.getLastChatMessage(chat._id).then(function(msg){
   return userRepo.findByID(userID).then(function(user) {
 
   var obj = new dtos.chatDTO(chat, user, msg);
   
   chatDtos.push(obj);  
   return chatDtos;

    });
 });
}
 
});

};

///////////////////getContactList////////////////////////////////////////////
 function getContactList(userID) {
 return chatRepo.find({"members":userID}).then(function(chats){
  var contacts=[];
  var contctUserIDs=[];
  //1-get chats that i have been involved in.
  //2-Extract unique members users ids
  //3-get users complete info per each unique user id.
  for (var i = chats.length - 1; i >= 0; i--) {
  var chatMembers=  chats[i].members; 
  for (var c = chatMembers.length - 1; c >= 0; c--) {
     contctUserIDs.push(chatMembers[c]);
  }
  
  }
  //remove duplicate ids.
  contctUserIDs= unique(contctUserIDs);
 //remove userid from the list
  var index = contctUserIDs.indexOf(userID);    // <-- Not supported in <IE9
  if (index !== -1) {
      contctUserIDs.splice(index, 1);
  }
  //here :contctUserIDs represne the unique contacts of this account.
  console.log(contctUserIDs);
 
 return  userervice.getMultipleUsers(contctUserIDs).then(function(users){
    contacts=users;

  return contacts;

    });
});

}
  

///////////////////returns (ListOfMessages and Memebr User Object) ///////////////////////////////////////////////
  function getChatDetails(chatId,loggedUserID) {
return  chatRepo.findByID(chatId).then(function(chat) {
   var chatDetails={};
 var contactUserID=chat.members.filter(function(value){ return value !==loggedUserID;});

   return  userRepo.findByID(contactUserID).then(function(user) {

  return messageService.getMessagesByChatId(chatId).then(function(messages){


  chatDetails = dtos.chatDetailDTO(chat,user,messages)

 return chatDetails;
});
  
 });

     
   });
};



 

module.exports={

getAllChats: function(){ return getAllChats();},
 
createChat: function(newChat){ return createChat(newChat);},
 
getChatsByMemberUserID: function(userId){ return getChatsByMemberUserID(userId);},

getContactList: function(userId){ return getContactList(userId);},

getChatDetails: function(chatId,loggedUserID){ return getChatDetails(chatId,loggedUserID);}

}