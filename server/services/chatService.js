

var unique = require('array-unique');
var async = require('async');

const chat = require("../models/chatModel")
  

var mongoose = require('mongoose');  
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

function filter_ids(event,contactUserID) {
    return event._id == contactUserID;
}


 function getChatsByMemberUserID(userID) {
  
var chatDtos=[];
var contactUsers=[];
var arrPromises=[];
var arrMsgPromises=[];

 var chatsPromise=chatRepo.find({"members":{ $in : [userID] }}).then(function(chats){
  return chats;
 });
var promiseUsers=userRepo.find({}).then(function(users){
    return users;
});
arrPromises.push(chatsPromise);
arrPromises.push(promiseUsers);

return Promise.all(arrPromises).then(function(results){

var chats=results[0];

var users=results[1];
 
  //ToDo:Get LastMessage For Each Chat.
  for (var i = chats.length - 1; i >= 0; i--) {
   var chat= chats[i];
   var contactUserID=chat.members.filter(function(value){return value !==userID;});
   var user= users.filter(function(value){return value._id.toString() ==contactUserID; })[0];

   contactUsers.push(user);
   var lastMsgPromise=  messageService.getLastChatMessage(chat._id);

   arrMsgPromises.push(lastMsgPromise);
}
//resolve msgs
return Promise.all(arrMsgPromises).then(function(results){
for (var i = results.length - 1; i >= 0; i--) {
  var msg=results[i];
  var user=contactUsers[i];
  var obj = new dtos.chatDTO(chat, user, msg);
  chatDtos.push(obj); 

}
 
return chatDtos;

});
 
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



 ////////////////////getCreateChatByMembers //////////////////////////////////
function getCreateChatByMembers(arrMemebers,loggedInUser){


  console.log('arrMemebersarrMemebersarrMemebersarrMemebers:  '+ arrMemebers);
 return chatRepo.find({"members":{ $in: [arrMemebers] } },null,null,1,null).then(function(ExistedChat){
   console.log('ExistedChat:  '+ ExistedChat);
  if(ExistedChat!="")//existed chat
 {
     
  console.log('ExistedChat:  '+ ExistedChat);
   return  getChatDetails(ExistedChat._id,loggedInUser).then(function(detail){

return detail;

   });
    

 } else{//cretae chat
var new_chat=new chat();
new_chat.members=arrMemebers;

  console.log('new_chat:  '+ new_chat);
 return createChat(new_chat).then(function(newChat){
 
  console.log('newChat:  '+ newChat);


 return  getChatDetails(newChat._id,loggedInUser).then(function(detail){

return detail;

   });


 });


   
 };
});
};




module.exports={

getAllChats: function(){ return getAllChats();},
 
createChat: function(newChat){ return createChat(newChat);},
 
getChatsByMemberUserID: function(userId){ return getChatsByMemberUserID(userId);},

getContactList: function(userId){ return getContactList(userId);},

getChatDetails: function(chatId,loggedUserID){ return getChatDetails(chatId,loggedUserID);},

getCreateChatByMembers: function(arrMemebers,loggedInUser){return getCreateChatByMembers(arrMemebers,loggedInUser);}

}