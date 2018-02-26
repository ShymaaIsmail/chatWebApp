function chatDTO(chatModelObj,contactUserObj,LastMessageObj) {
	var obj=new Object();
     obj.chatID = chatModelObj._id;
      obj.member=contactUserObj;
      obj.lastMessage=LastMessageObj;
   
   return obj;
}

function chatDetailDTO(chatModelObj,contactUserObj,arrMessages) {
	var obj=new Object();
    obj.chatID = chatModelObj._id;
    obj.messages = arrMessages;
    obj.member=contactUserObj;
   //TO DO : map remainig props
   return obj;
}



module.exports={

chatDTO: function(chatModelObj,contactUserObj,LastMessageObj){ return chatDTO(chatModelObj,contactUserObj,LastMessageObj);},
 

chatDetailDTO: function(chatModelObj,contactUserObj,arrMessages){ return chatDetailDTO(chatModelObj,contactUserObj,arrMessages);},
 
 }