'use strict';
/* This chatDTOMapper Class is to extract values from multiple objects into a single new object to faclate binding data */
export default class chatDTOMapper{

    chatDTO (chatModelObj,contactUserObj,LastMessageObj)
    {
        var obj=new Object();
        obj.chatID = chatModelObj._id;
         obj.member=contactUserObj;
         obj.lastMessage=LastMessageObj;
      
      return obj;
    }

    chatDetailDTO(chatModelObj,contactUserObj,arrMessages){
        var obj=new Object();
        obj.chatID = chatModelObj._id;
        obj.messages = arrMessages;
        obj.member=contactUserObj;
        return obj;
    }

}