
const message = require("../models/messageModel")
  
var  repos = require("../Repositories/Repos.js") ;


var messageRepo = repos.messageRepo;


function createMessage(newMessage){


return messageRepo.add(newMessage).then(function(msg) {
   return msg;
});
}

  function getLastChatMessage(chatId) {
  	 
//categoryRepo.find({isActive: true}, "categoryName description", 10, 10, {categoryName: 1})
 return messageRepo.find({"chatID":chatId},null,null,1,{ Created_date: 1 }).then(function(msgs){
 	 
    return msgs;
});
};


 function getMessagesByChatId(chatId) {
 return messageRepo.find({"chatID":chatId}).then(function(msgs){
    return msgs;
});
};



module.exports={

createMessage: function (newMessage){return createMessage(newMessage);},
getLastChatMessage: function(chatId){ return getLastChatMessage(chatId);},
 


getMessagesByChatId: function(chatId){ return getMessagesByChatId(chatId);},
 

 }