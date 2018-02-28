'use strict';
 const chat = require("../models/chatModel")
  
var  chatService = require("../services/chatService.js") ;
 

exports.list_all_chats = function(req, res) {
chatService.getAllChats().then(function(chats){
  console.log(chats); //Return all chat entries 
  res.json(chats);
}).catch(function(err) {
  console.log(err.message);
});
};


exports.create_chat = function(req, res) {
 var new_chat = new chat(req.body);
  
chatService.createChat(new_chat).then(function(chat){
  console.log(chat);  
  res.json(chat);
}).catch(function(err) {
  console.log(err.message);
});
};

  
exports.chats_by_memberUserID = function(req, res) {

var tt=chatService.getChatsByMemberUserID(req.params.userId);
chatService.getChatsByMemberUserID(req.params.userId).then(function(chats){
   res.json(chats);
}).catch(function(err) {
  console.log(err.message);
});
};

exports.contact_list = function(req, res) {
chatService.getContactList(req.params.userId).then(function(chats){
  console.log(chats); //Return all user entries 
  res.json(chats);
}).catch(function(err) {
  console.log(err.message);
});
};


exports.chat_details = function(req, res) {

chatService.getChatDetails(req.params.chatId,req.params.loggedUserID).then(function(chats){
  console.log(chats); //Return all user entries 
  res.json(chats);
}).catch(function(err) {
  console.log(err.message);
});

};

exports.create_get_chat=function(req,res) {

var loggedInUser =  req.params.loggedInUser;

var otherContact =  req.params.otherContact;

var members=[otherContact,loggedInUser];

  console.log('membersmembersmembersmembers'+members); 

chatService.getCreateChatByMembers(members,loggedInUser).then(function(chat){
  console.log(chat); //Return all user entries 
  res.json(chat);
}).catch(function(err) {
  console.log(err.message);
});
 };